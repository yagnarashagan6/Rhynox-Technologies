import connectDB from "./db.js";
import InternalProject from "./models/InternalProject.js";
import EngagementEvent from "./models/EngagementEvent.js";
import ContactSubmission from "./models/ContactSubmission.js";
import ChatbotSession from "./models/ChatbotSession.js";
import ClickAnalytics from "./models/ClickAnalytics.js";

const EVENT_TYPES = [
  "page_view",
  "contact_form_submit",
  "chatbot_open",
  "chatbot_message",
  "whatsapp_click",
  "call_click",
  "social_share",
  "cta_click",
];
const RANGES = { today: 1, "7d": 7, "30d": 30, "90d": 90 };

const rangeStart = (range = "30d") => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((RANGES[range] || RANGES["30d"]) - 1));
  return start;
};

const analyticsMatch = (range) => ({ timestamp: { $gte: rangeStart(range) } });
const sourceType = (referrer = "") => {
  const value = referrer.toLowerCase();
  if (!value) return "Direct";
  if (/google|bing|yahoo|duckduckgo/.test(value)) return "Search";
  if (
    /facebook|instagram|linkedin|twitter|x\\.com|youtube|whatsapp/.test(value)
  )
    return "Social";
  return "Referral";
};

const jsonBody = (req) =>
  req.body && typeof req.body === "object" ? req.body : {};

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,POST,PUT,DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const resource = req.query?.resource;
  const id = req.query?.id;

  try {
    await connectDB();

    if (resource === "internal-projects") {
      if (req.method === "GET")
        return res.json(await InternalProject.find().sort({ lastUpdated: -1 }));
      if (req.method === "POST")
        return res
          .status(201)
          .json(await InternalProject.create(jsonBody(req)));
      if (req.method === "PUT" && id) {
        const project = await InternalProject.findByIdAndUpdate(
          id,
          jsonBody(req),
          { new: true, runValidators: true },
        );
        return project
          ? res.json(project)
          : res.status(404).json({ error: "Project not found" });
      }
      if (req.method === "DELETE" && id) {
        const project = await InternalProject.findByIdAndDelete(id);
        return project
          ? res.status(204).end()
          : res.status(404).json({ error: "Project not found" });
      }
    }

    if (resource === "analytics-click") {
      if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });
      const { buttonType } = jsonBody(req);
      if (!["whatsapp", "mobile"].includes(buttonType))
        return res.status(400).json({ error: "Invalid button type" });
      return res.json(
        await ClickAnalytics.findOneAndUpdate(
          { buttonType },
          { $inc: { count: 1 }, updatedAt: Date.now() },
          { upsert: true, new: true },
        ),
      );
    }

    if (resource === "analytics-clicks") {
      if (req.method !== "GET")
        return res.status(405).json({ error: "Method not allowed" });
      return res.json(await ClickAnalytics.find());
    }

    if (resource === "analytics-events") {
      if (req.method === "POST") {
        const body = jsonBody(req);
        if (!EVENT_TYPES.includes(body.eventType))
          return res.status(400).json({ error: "Invalid event type" });
        return res.status(201).json(
          await EngagementEvent.create({
            eventType: body.eventType,
            sessionId: body.sessionId,
            page: body.page,
            referrer: body.referrer,
            device: body.device,
            browser: body.browser,
            os: body.os,
            meta: body.meta,
          }),
        );
      }
      if (req.method === "GET") {
        const {
          limit: rawLimit = "25",
          range,
          cursor,
          type,
          page,
          search,
        } = req.query || {};
        const limit = Math.min(Number(rawLimit) || 25, 100);
        const filter = {};
        if (type) filter.eventType = { $in: String(type).split(",") };
        if (page) filter.page = { $regex: page, $options: "i" };
        if (search)
          filter.$or = [
            { sessionId: { $regex: search, $options: "i" } },
            { page: { $regex: search, $options: "i" } },
          ];
        if (cursor) filter.timestamp = { $lt: new Date(cursor) };
        if (range)
          filter.timestamp = {
            ...(filter.timestamp || {}),
            $gte: rangeStart(range),
          };
        const events = await EngagementEvent.find(filter)
          .sort({ timestamp: -1 })
          .limit(limit + 1)
          .lean();
        const hasMore = events.length > limit;
        const data = hasMore ? events.slice(0, limit) : events;
        return res.json({
          events: data,
          nextCursor: hasMore
            ? data[data.length - 1].timestamp.toISOString()
            : null,
        });
      }
    }

    if (resource === "analytics-events-export") {
      if (req.method !== "GET")
        return res.status(405).json({ error: "Method not allowed" });
      const events = await EngagementEvent.find(
        analyticsMatch(req.query?.range),
      )
        .sort({ timestamp: -1 })
        .lean();
      const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
      const rows = [
        "Timestamp,Event Type,Page,Referrer,Session ID,Device",
        ...events.map((event) =>
          [
            event.timestamp.toISOString(),
            event.eventType,
            event.page,
            event.referrer,
            event.sessionId,
            event.device,
          ]
            .map(quote)
            .join(","),
        ),
      ];
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="activity-logs.csv"',
      );
      return res.send(rows.join("\n"));
    }

    if (
      [
        "analytics-overview",
        "analytics-traffic",
        "analytics-sources",
        "analytics-devices",
      ].includes(resource)
    ) {
      const range = req.query?.range;
      const match = analyticsMatch(range);

      if (resource === "analytics-overview") {
        const [
          events,
          sessions,
          contacts,
          chatbotSessions,
          ongoingProjects,
          legacyClicks,
          pageViews,
          clickEvents,
        ] = await Promise.all([
          EngagementEvent.find(match).sort({ timestamp: -1 }).limit(10),
          EngagementEvent.distinct("sessionId", {
            ...match,
            eventType: "page_view",
            sessionId: { $ne: null },
          }),
          ContactSubmission.countDocuments({
            createdAt: { $gte: rangeStart(range) },
          }),
          ChatbotSession.countDocuments({
            startedAt: { $gte: rangeStart(range) },
          }),
          InternalProject.countDocuments({ status: "in_progress" }),
          ClickAnalytics.find(),
          EngagementEvent.countDocuments({ ...match, eventType: "page_view" }),
          EngagementEvent.aggregate([
            {
              $match: {
                ...match,
                eventType: { $in: ["whatsapp_click", "call_click"] },
              },
            },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
          ]),
        ]);
        const legacy = Object.fromEntries(
          legacyClicks.map((item) => [item.buttonType, item.count]),
        );
        const eventCounts = Object.fromEntries(
          clickEvents.map((item) => [item._id, item.count]),
        );
        const totalVisitors = sessions.length || pageViews;
        return res.json({
          totalVisitors,
          uniqueVisitors: sessions.length,
          pageViews,
          contactSubmissions: contacts,
          chatbotSessions,
          ongoingProjects,
          whatsappClicks: legacy.whatsapp ?? (eventCounts.whatsapp_click || 0),
          mobileClicks: legacy.mobile ?? (eventCounts.call_click || 0),
          conversionRate: totalVisitors
            ? Number(((contacts / totalVisitors) * 100).toFixed(1))
            : 0,
          recentActivity: events,
        });
      }

      if (resource === "analytics-traffic") {
        return res.json(
          await EngagementEvent.aggregate([
            { $match: { ...match, eventType: "page_view" } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                views: { $sum: 1 },
                visitors: { $addToSet: "$sessionId" },
              },
            },
            {
              $project: {
                _id: 0,
                date: "$_id",
                views: 1,
                visitors: { $size: "$visitors" },
              },
            },
            { $sort: { date: 1 } },
          ]),
        );
      }

      const views = await EngagementEvent.find({
        ...match,
        eventType: "page_view",
      })
        .select("referrer page device browser os")
        .lean();
      if (resource === "analytics-sources") {
        const sources = views.reduce((result, event) => {
          const type = sourceType(event.referrer);
          result[type] = (result[type] || 0) + 1;
          return result;
        }, {});
        const domains = views.reduce((result, event) => {
          if (!event.referrer) return result;
          try {
            const domain = new URL(event.referrer).hostname;
            result[domain] = (result[domain] || 0) + 1;
          } catch {}
          return result;
        }, {});
        const pages = views.reduce((result, event) => {
          const page = event.page || "/";
          result[page] = (result[page] || 0) + 1;
          return result;
        }, {});
        return res.json({
          sources: Object.entries(sources).map(([name, value]) => ({
            name,
            value,
          })),
          referrers: Object.entries(domains)
            .map(([domain, visits]) => ({ domain, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10),
          pages: Object.entries(pages)
            .map(([path, count]) => ({ path, views: count }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10),
        });
      }
      const count = (key) =>
        Object.entries(
          views.reduce((all, event) => {
            const value = event[key] || "Unknown";
            all[value] = (all[value] || 0) + 1;
            return all;
          }, {}),
        ).map(([name, value]) => ({ name, value }));
      return res.json({
        devices: count("device"),
        browsers: count("browser"),
        operatingSystems: count("os"),
      });
    }

    if (resource === "lead-contacts") {
      if (req.method === "GET") {
        const filter = {};
        if (req.query?.status) filter.status = req.query.status;
        if (req.query?.search)
          filter.$or = ["name", "email", "message"].map((key) => ({
            [key]: { $regex: req.query.search, $options: "i" },
          }));
        return res.json(
          await ContactSubmission.find(filter).sort({ createdAt: -1 }),
        );
      }
      if (req.method === "PATCH" && id) {
        const body = jsonBody(req);
        const update = {};
        if (body.status) update.status = body.status;
        if (body.note?.text)
          update.$push = {
            notes: {
              text: body.note.text,
              author: body.note.author || "Admin",
            },
          };
        const contact = await ContactSubmission.findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        });
        return contact
          ? res.json(contact)
          : res.status(404).json({ error: "Contact not found" });
      }
    }

    if (resource === "chatbot-sessions" && req.method === "GET") {
      return res.json(await ChatbotSession.find().sort({ startedAt: -1 }));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin API error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Admin API request failed" });
  }
}
