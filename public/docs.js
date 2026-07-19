/* =========================================================
   CampVerse API - interactive documentation
   ========================================================= */
const BASE = "/api/v1";
const AUTH_NOTE = "Send the JWT as a Bearer token in the Authorization header, or rely on the httpOnly cookie set at login.";

/* ---- Inline SVG icons (stroke = currentColor) ---- */
const ICONS = {
  cap:    `<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/>`,
  book:   `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>`,
  star:   `<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>`,
  lock:   `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  users:  `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  zap:    `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>`,
  key:    `<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>`,
  user:   `<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>`,
  login:  `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><line x1="15" y1="12" x2="3" y2="12"/>`,
  logout: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><line x1="21" y1="12" x2="9" y2="12"/>`,
};
function icon(name, size) {
  size = size || 16;
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

const GROUPS = [
  {
    id: "bootcamps", name: "Bootcamps", icon: "cap",
    blurb: "Create and browse coding bootcamps. Supports field selection, sorting, pagination and operator-based filtering. A publisher may own only one bootcamp.",
    endpoints: [
      {
        method: "GET", path: "/bootcamps", access: "Public",
        summary: "List all bootcamps",
        desc: "Returns all bootcamps with their populated courses. Supports rich query features: filter by any field (with gt, gte, lt, lte, in operators), select specific fields, sort, and paginate. The response includes a pagination object with next and prev pages.",
        query: [
          ["select", "string", false, "Comma-separated fields to return, e.g. name,description"],
          ["sort", "string", false, "Field to sort by; prefix with - for descending, e.g. -averageCost. Defaults to -createdAt"],
          ["page", "number", false, "Page number (default 1)"],
          ["limit", "number", false, "Results per page (default 25)"],
          ["{field}[operator]", "any", false, "Filter operator, e.g. averageCost[lte]=10000 or careers[in]=Business"],
        ],
        example: "/bootcamps?select=name,averageCost&sort=name&page=1&limit=10",
        response: { success: true, count: 2, pagination: { next: { page: 2, limit: 10 } }, data: [ { _id: "5d713995b721c3bb38c1f5d0", name: "Devworks Bootcamp", averageCost: 10000 } ] }
      },
      {
        method: "GET", path: "/bootcamps/:id", access: "Public",
        summary: "Get a single bootcamp",
        desc: "Fetch one bootcamp by its MongoDB ObjectId, including its virtual list of associated courses.",
        params: [["id", "ObjectId", true, "The bootcamp's unique id"]],
        example: "/bootcamps/5d713995b721c3bb38c1f5d0",
        response: { success: true, data: { _id: "5d713995b721c3bb38c1f5d0", name: "Devworks Bootcamp", careers: ["Web Development","UI/UX"], averageRating: 8, housing: true } }
      },
      {
        method: "POST", path: "/bootcamps", access: "Private",
        summary: "Create a bootcamp",
        desc: "Create a new bootcamp. Requires the publisher or admin role, and a publisher may own only one bootcamp. A URL-friendly slug is generated from the name automatically.",
        auth: true, roles: "publisher, admin",
        body: [
          ["name", "string", true, "Unique name, max 50 chars"],
          ["description", "string", true, "Max 500 chars"],
          ["address", "string", true, "Full address of the bootcamp"],
          ["careers", "string[]", true, "One or more of: Web Development, Mobile Development, UI/UX, Data Science, Business, Other"],
          ["website", "string", false, "Valid http/https URL"],
          ["phone", "string", false, "Max 20 chars"],
          ["email", "string", false, "Valid email"],
          ["housing", "boolean", false, "Defaults false"],
          ["jobAssistance", "boolean", false, "Defaults false"],
          ["jobGuarantee", "boolean", false, "Defaults false"],
          ["acceptGi", "boolean", false, "Accepts the GI Bill, defaults false"],
        ],
        sampleBody: { name: "My New Bootcamp", description: "A great place to learn to code", address: "123 Main St, Boston MA 02118", careers: ["Web Development","UI/UX"], housing: true, website: "https://mybootcamp.com" },
        example: "/bootcamps",
        response: { success: true, data: { _id: "5f0e12ab34cd56ef78901234", name: "My New Bootcamp", slug: "my-new-bootcamp" } }
      },
      {
        method: "PUT", path: "/bootcamps/:id", access: "Private",
        summary: "Update a bootcamp",
        desc: "Update fields on a bootcamp you own. Only the owning publisher or an admin may update it.",
        auth: true, roles: "publisher, admin",
        params: [["id", "ObjectId", true, "The bootcamp's unique id"]],
        sampleBody: { housing: false, jobGuarantee: true },
        example: "/bootcamps/5d713995b721c3bb38c1f5d0",
        response: { success: true, data: { _id: "5d713995b721c3bb38c1f5d0", jobGuarantee: true } }
      },
      {
        method: "DELETE", path: "/bootcamps/:id", access: "Private",
        summary: "Delete a bootcamp",
        desc: "Delete a bootcamp you own. This cascade-deletes all of its courses. Only the owning publisher or an admin may delete it.",
        auth: true, roles: "publisher, admin",
        params: [["id", "ObjectId", true, "The bootcamp's unique id"]],
        example: "/bootcamps/5d713995b721c3bb38c1f5d0",
        response: { success: true, data: {} }
      },
      {
        method: "PUT", path: "/bootcamps/:id/photo", access: "Private",
        summary: "Upload a bootcamp photo",
        desc: "Upload a cover photo for a bootcamp (multipart/form-data, field name 'file'). Max size is set by MAX_FILE_UPLOAD. Only the owner or an admin may upload.",
        auth: true, roles: "publisher, admin",
        params: [["id", "ObjectId", true, "The bootcamp's unique id"]],
        formData: [["file", "image", true, "Image file to upload"]],
        example: "/bootcamps/5d713995b721c3bb38c1f5d0/photo",
        response: { success: true, data: "photo_5d713995b721c3bb38c1f5d0.jpg" }
      },
    ]
  },
  {
    id: "courses", name: "Courses", icon: "book",
    blurb: "Courses always belong to a bootcamp. Adding, updating or removing a course recalculates the parent bootcamp's average cost.",
    endpoints: [
      {
        method: "GET", path: "/courses", access: "Public",
        summary: "List all courses",
        desc: "Returns every course across all bootcamps, each populated with its parent bootcamp's name and description. Supports the same select, sort, page and limit query features as bootcamps.",
        query: [["select","string",false,"Fields to return"],["sort","string",false,"Sort field"],["page","number",false,"Page number"],["limit","number",false,"Results per page"]],
        example: "/courses?select=title,tuition&sort=tuition",
        response: { success: true, count: 10, pagination: {}, data: [ { _id: "5d725a037b292f5f8ceff787", title: "Front End Web Development", tuition: 8000, bootcamp: { name: "Devworks Bootcamp" } } ] }
      },
      {
        method: "GET", path: "/bootcamps/:bootcampId/courses", access: "Public",
        summary: "List courses for a bootcamp",
        desc: "Returns only the courses that belong to the specified bootcamp.",
        params: [["bootcampId","ObjectId",true,"Id of the parent bootcamp"]],
        example: "/bootcamps/5d713995b721c3bb38c1f5d0/courses",
        response: { success: true, count: 2, data: [ { _id: "5d725a037b292f5f8ceff787", title: "Front End Web Development", weeks: "8", tuition: 8000 } ] }
      },
      {
        method: "GET", path: "/courses/:id", access: "Public",
        summary: "Get a single course",
        desc: "Fetch one course by id, populated with its parent bootcamp's name and description.",
        params: [["id","ObjectId",true,"The course's unique id"]],
        example: "/courses/5d725a4a7b292f5f8ceff789",
        response: { success: true, data: { _id: "5d725a4a7b292f5f8ceff789", title: "Front End Web Development", minimumSkill: "beginner", tuition: 8000 } }
      },
      {
        method: "POST", path: "/bootcamps/:bootcampId/courses", access: "Private",
        summary: "Add a course to a bootcamp",
        desc: "Create a course under a bootcamp. You must own the bootcamp (or be an admin). Saving recalculates the bootcamp's averageCost.",
        auth: true, roles: "publisher, admin",
        params: [["bootcampId","ObjectId",true,"Id of the parent bootcamp"]],
        body: [
          ["title","string",true,"Course title"],
          ["description","string",true,"What the course covers"],
          ["weeks","string",true,"Duration in weeks"],
          ["tuition","number",true,"Tuition cost"],
          ["minimumSkill","string",true,"One of: beginner, intermediate, advanced"],
          ["scholarshipAvailable","boolean",false,"Defaults false"],
        ],
        sampleBody: { title: "Full Stack Web Dev", description: "Learn the MERN stack end to end", weeks: "12", tuition: 12000, minimumSkill: "intermediate", scholarshipAvailable: true },
        example: "/bootcamps/5d713995b721c3bb38c1f5d0/courses",
        response: { success: true, data: { _id: "5f1a98cd12ab34ef56789012", title: "Full Stack Web Dev", bootcamp: "5d713995b721c3bb38c1f5d0" } }
      },
      {
        method: "PUT", path: "/courses/:id", access: "Private",
        summary: "Update a course",
        desc: "Update a course you own (or as admin). Changing tuition recalculates the bootcamp's average cost.",
        auth: true, roles: "publisher, admin",
        params: [["id","ObjectId",true,"The course's unique id"]],
        sampleBody: { tuition: 13000, scholarshipAvailable: false },
        example: "/courses/5d725a4a7b292f5f8ceff789",
        response: { success: true, data: { _id: "5d725a4a7b292f5f8ceff789", tuition: 13000 } }
      },
      {
        method: "DELETE", path: "/courses/:id", access: "Private",
        summary: "Delete a course",
        desc: "Delete a course you own (or as admin). The bootcamp's average cost is recalculated afterwards.",
        auth: true, roles: "publisher, admin",
        params: [["id","ObjectId",true,"The course's unique id"]],
        example: "/courses/5d725a4a7b292f5f8ceff789",
        response: { success: true, data: {} }
      },
    ]
  },
  {
    id: "reviews", name: "Reviews", icon: "star",
    blurb: "Ratings from 1 to 10 that feed a bootcamp's averageRating. Each user may leave at most one review per bootcamp.",
    endpoints: [
      {
        method: "GET", path: "/reviews", access: "Public",
        summary: "List all reviews",
        desc: "Returns every review, each populated with its bootcamp's name and description. Supports select, sort, page and limit.",
        example: "/reviews?sort=-rating&limit=5",
        response: { success: true, count: 3, pagination: {}, data: [ { _id: "5d7a514b5d2c12c7449be020", title: "Learned a ton", rating: 9, bootcamp: { name: "Devworks Bootcamp" } } ] }
      },
      {
        method: "GET", path: "/bootcamps/:bootcampId/reviews", access: "Public",
        summary: "List reviews for a bootcamp",
        desc: "Returns only the reviews written for the specified bootcamp.",
        params: [["bootcampId","ObjectId",true,"Id of the parent bootcamp"]],
        example: "/bootcamps/5d713995b721c3bb38c1f5d0/reviews",
        response: { success: true, count: 1, data: [ { _id: "5d7a514b5d2c12c7449be020", title: "Great experience", text: "Highly recommend", rating: 8 } ] }
      },
      {
        method: "GET", path: "/reviews/:id", access: "Public",
        summary: "Get a single review",
        desc: "Fetch one review by id, populated with its bootcamp's name and description.",
        params: [["id","ObjectId",true,"The review's unique id"]],
        example: "/reviews/5d7a514b5d2c12c7449be020",
        response: { success: true, data: { _id: "5d7a514b5d2c12c7449be020", title: "Great experience", rating: 8 } }
      },
      {
        method: "POST", path: "/bootcamps/:bootcampId/reviews", access: "Private",
        summary: "Add a review",
        desc: "Submit a review for a bootcamp. Requires the user or admin role. A user can only review a given bootcamp once. Saving updates the bootcamp's averageRating.",
        auth: true, roles: "user, admin",
        params: [["bootcampId","ObjectId",true,"Id of the bootcamp being reviewed"]],
        body: [
          ["title","string",true,"Short review title, max 100 chars"],
          ["text","string",true,"The review body"],
          ["rating","number",true,"Rating from 1 to 10"],
        ],
        sampleBody: { title: "Best decision ever", text: "The curriculum and instructors were fantastic.", rating: 9 },
        example: "/bootcamps/5d713995b721c3bb38c1f5d0/reviews",
        response: { success: true, data: { _id: "5f2b76ef90ab12cd34567890", title: "Best decision ever", rating: 9 } }
      },
      {
        method: "PUT", path: "/reviews/:id", access: "Private",
        summary: "Update a review",
        desc: "Update your own review (or any as admin). The bootcamp's average rating is recalculated.",
        auth: true, roles: "user, admin",
        params: [["id","ObjectId",true,"The review's unique id"]],
        sampleBody: { rating: 10, text: "Even better on reflection." },
        example: "/reviews/5d7a514b5d2c12c7449be020",
        response: { success: true, data: { _id: "5d7a514b5d2c12c7449be020", rating: 10 } }
      },
      {
        method: "DELETE", path: "/reviews/:id", access: "Private",
        summary: "Delete a review",
        desc: "Delete your own review (or any as admin). The bootcamp's average rating is recalculated.",
        auth: true, roles: "user, admin",
        params: [["id","ObjectId",true,"The review's unique id"]],
        example: "/reviews/5d7a514b5d2c12c7449be020",
        response: { success: true, data: {} }
      },
    ]
  },
  {
    id: "auth", name: "Authentication", icon: "lock",
    blurb: "Register, log in and manage your own account. A successful login returns a JWT (30-day expiry) both in the body and as an httpOnly cookie.",
    endpoints: [
      {
        method: "POST", path: "/auth/register", access: "Public",
        summary: "Register a new user",
        desc: "Create an account as a user or publisher. Returns a JWT on success.",
        body: [
          ["name","string",true,"Display name"],
          ["email","string",true,"Unique, valid email"],
          ["password","string",true,"Min 6 characters"],
          ["role","string",false,"'user' or 'publisher' (defaults to user). 'admin' cannot be self-assigned."],
        ],
        sampleBody: { name: "John Doe", email: "john@example.com", password: "123456", role: "publisher" },
        example: "/auth/register",
        response: { success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      },
      {
        method: "POST", path: "/auth/login", access: "Public",
        summary: "Log in",
        desc: "Authenticate with email and password. Sets an httpOnly cookie and returns the JWT in the body.",
        body: [["email","string",true,"Account email"],["password","string",true,"Account password"]],
        sampleBody: { email: "john@example.com", password: "123456" },
        example: "/auth/login",
        response: { success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      },
      {
        method: "GET", path: "/auth/me", access: "Private",
        summary: "Get current user",
        desc: "Returns the profile of the currently authenticated user.",
        auth: true,
        example: "/auth/me",
        response: { success: true, data: { _id: "5c8a1d5b0190b214360dc031", name: "John Doe", email: "john@example.com", role: "publisher" } }
      },
      {
        method: "PUT", path: "/auth/updatedetails", access: "Private",
        summary: "Update your details",
        desc: "Update the authenticated user's name and email.",
        auth: true,
        body: [["name","string",false,"New display name"],["email","string",false,"New email"]],
        sampleBody: { name: "John D. Doe", email: "johnd@example.com" },
        example: "/auth/updatedetails",
        response: { success: true, data: { _id: "5c8a1d5b0190b214360dc031", name: "John D. Doe", email: "johnd@example.com" } }
      },
      {
        method: "PUT", path: "/auth/updatepassword", access: "Private",
        summary: "Update your password",
        desc: "Change the authenticated user's password. Requires the current password. Returns a fresh JWT.",
        auth: true,
        body: [["currentPassword","string",true,"Existing password"],["newPassword","string",true,"New password, min 6 chars"]],
        sampleBody: { currentPassword: "123456", newPassword: "abcdef" },
        example: "/auth/updatepassword",
        response: { success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      },
      {
        method: "POST", path: "/auth/forgotPassword", access: "Public",
        summary: "Request a password reset",
        desc: "Emails a password reset token to the account's address. Use it with the reset endpoint below.",
        body: [["email","string",true,"Account email"]],
        sampleBody: { email: "john@example.com" },
        example: "/auth/forgotPassword",
        response: { success: true, data: "Email sent" }
      },
      {
        method: "PUT", path: "/auth/resetPassword/:resettoken", access: "Public",
        summary: "Reset password with token",
        desc: "Set a new password using the token emailed by /auth/forgotPassword. The token expires 10 minutes after it is issued.",
        params: [["resettoken","string",true,"The token from the reset email"]],
        body: [["password","string",true,"New password, min 6 chars"]],
        sampleBody: { password: "newpass123" },
        example: "/auth/resetPassword/abc123resettoken",
        response: { success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      },
      {
        method: "GET", path: "/auth/logout", access: "Private",
        summary: "Log out",
        desc: "Clears the authentication cookie, logging the current user out.",
        auth: true,
        example: "/auth/logout",
        response: { success: true, data: {} }
      },
    ]
  },
  {
    id: "users", name: "Users", icon: "users",
    blurb: "Admin-only user management. Every route in this group requires an authenticated admin.",
    endpoints: [
      {
        method: "GET", path: "/users", access: "Admin",
        summary: "List all users",
        desc: "Returns all users. Supports select, sort, page and limit. Admin only.",
        auth: true, roles: "admin",
        example: "/users?sort=name&limit=25",
        response: { success: true, count: 5, pagination: {}, data: [ { _id: "5c8a1d5b0190b214360dc031", name: "John Doe", role: "publisher" } ] }
      },
      {
        method: "GET", path: "/users/:id", access: "Admin",
        summary: "Get a single user",
        desc: "Fetch one user by id. Admin only.",
        auth: true, roles: "admin",
        params: [["id","ObjectId",true,"The user's unique id"]],
        example: "/users/5c8a1d5b0190b214360dc031",
        response: { success: true, data: { _id: "5c8a1d5b0190b214360dc031", name: "John Doe", email: "john@example.com", role: "user" } }
      },
      {
        method: "POST", path: "/users", access: "Admin",
        summary: "Create a user",
        desc: "Create a user directly, including setting the role. Admin only.",
        auth: true, roles: "admin",
        body: [["name","string",true,"Display name"],["email","string",true,"Unique email"],["password","string",true,"Min 6 chars"],["role","string",false,"user, publisher or admin"]],
        sampleBody: { name: "Jane Admin", email: "jane@example.com", password: "123456", role: "admin" },
        example: "/users",
        response: { success: true, data: { _id: "5f3ca1b298ef01cd23456789", name: "Jane Admin", role: "admin" } }
      },
      {
        method: "PUT", path: "/users/:id", access: "Admin",
        summary: "Update a user",
        desc: "Update any user's fields, including their role. Admin only.",
        auth: true, roles: "admin",
        params: [["id","ObjectId",true,"The user's unique id"]],
        sampleBody: { role: "publisher" },
        example: "/users/5c8a1d5b0190b214360dc031",
        response: { success: true, data: { _id: "5c8a1d5b0190b214360dc031", role: "publisher" } }
      },
      {
        method: "DELETE", path: "/users/:id", access: "Admin",
        summary: "Delete a user",
        desc: "Permanently delete a user. Admin only.",
        auth: true, roles: "admin",
        params: [["id","ObjectId",true,"The user's unique id"]],
        example: "/users/5c8a1d5b0190b214360dc031",
        response: { success: true, data: {} }
      },
    ]
  },
];

/* =========================================================
   HELPERS
   ========================================================= */
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const slug = (m, p) => (m + p).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function highlightJSON(obj) {
  const json = JSON.stringify(obj, null, 2);
  return esc(json)
    .replace(/&quot;([^&]+)&quot;(\s*:)/g, '<span class="tok-key">&quot;$1&quot;</span>$2')
    .replace(/: (&quot;[^&]*&quot;)/g, ': <span class="tok-str">$1</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="tok-num">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="tok-bool">$1</span>');
}

function pathHTML(p) {
  return p.split("/").map(seg => seg.startsWith(":") ? `<span class="var">/${esc(seg)}</span>` : (seg ? "/" + esc(seg) : "")).join("");
}

/* Format a JS value into an input string */
function fmtVal(v) {
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return String(v);
  return v == null ? "" : String(v);
}
/* Coerce an input string back to a typed value based on declared type */
function coerce(v, type) {
  if (/\[\]/.test(type) || /string\[\]/.test(type)) return v.split(",").map(s => s.trim()).filter(Boolean);
  if (/boolean/i.test(type)) return v.trim().toLowerCase() === "true";
  if (/number/i.test(type)) { const n = Number(v); return isNaN(n) ? v : n; }
  return v;
}

/* Pull default values for path params and query params out of ep.example */
function parseExample(ep) {
  const pathVals = {}, queryVals = {};
  const parts = (ep.example || ep.path).split("?");
  const pathPart = parts[0], queryPart = parts[1];
  const ps = ep.path.split("/");
  const es = pathPart.split("/");
  ps.forEach((seg, i) => { if (seg.startsWith(":")) pathVals[seg.slice(1)] = (es[i] || "").trim(); });
  if (queryPart) new URLSearchParams(queryPart).forEach((v, k) => { queryVals[k] = v; });
  return { pathVals, queryVals };
}

function paramTable(rows, firstCol) {
  const t = el("table", "params");
  const thead = el("thead");
  thead.appendChild(el("tr", null, `<th>${firstCol}</th><th>Type</th><th>Required</th><th>Description</th>`));
  t.appendChild(thead);
  const tb = el("tbody");
  rows.forEach(([name, type, req, desc]) => {
    tb.appendChild(el("tr", null,
      `<td class="pname mono">${esc(name)}</td>`+
      `<td class="ptype mono">${esc(type)}</td>`+
      `<td>${req ? '<span class="req">required</span>' : '<span class="opt">optional</span>'}</td>`+
      `<td>${esc(desc)}</td>`));
  });
  t.appendChild(tb);
  return t;
}

function codeBlock(html, raw) {
  const box = el("div", "codebox");
  const pre = el("pre", "mono"); pre.innerHTML = html;
  const btn = el("button", "copy", "Copy");
  btn.onclick = () => { navigator.clipboard.writeText(raw).then(() => { btn.textContent = "Copied!"; setTimeout(() => btn.textContent = "Copy", 1200); }); };
  box.appendChild(btn); box.appendChild(pre);
  return box;
}

/* =========================================================
   ENDPOINT CARD
   ========================================================= */
function buildEndpoint(ep) {
  const id = slug(ep.method, ep.path);
  const wrap = el("div", "endpoint"); wrap.id = id;
  wrap.dataset.search = (ep.method + " " + ep.path + " " + ep.summary + " " + ep.desc).toLowerCase();

  const head = el("div", "ep-head");
  head.innerHTML =
    `<span class="method m-${ep.method}">${ep.method}</span>`+
    `<span class="ep-path mono"><span class="base">${BASE}</span>${pathHTML(ep.path)}</span>`+
    `<span class="ep-summary">${esc(ep.summary)}</span>`+
    `<span class="access a-${ep.access}">${ep.access}</span>`+
    `<svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`;

  const body = el("div", "ep-body");
  body.appendChild(el("div", "desc", esc(ep.desc)));

  if (ep.auth) {
    body.appendChild(el("div", "block-label", "Authorization"));
    body.appendChild(el("div", "auth-note",
      `${icon("lock", 15)}<span>Requires authentication${ep.roles ? ` &middot; roles: <b style="color:var(--text)">${esc(ep.roles)}</b>` : ""}. ${AUTH_NOTE}</span>`));
  }

  if (ep.params)   { body.appendChild(el("div","block-label","Path Parameters")); body.appendChild(paramTable(ep.params, "Parameter")); }
  if (ep.query)    { body.appendChild(el("div","block-label","Query Parameters")); body.appendChild(paramTable(ep.query, "Parameter")); }
  if (ep.formData) { body.appendChild(el("div","block-label","Form Data (multipart)")); body.appendChild(paramTable(ep.formData, "Field")); }
  if (ep.body)     { body.appendChild(el("div","block-label","Request Body")); body.appendChild(paramTable(ep.body, "Field")); }

  body.appendChild(el("div","block-label","Example Response"));
  body.appendChild(codeBlock(highlightJSON(ep.response), JSON.stringify(ep.response, null, 2)));

  body.appendChild(buildTryIt(ep));

  head.onclick = () => {
    const wasOpen = wrap.classList.contains("open");
    wrap.classList.toggle("open");
    if (!wasOpen) history.replaceState(null, "", "#" + id);
  };

  wrap.appendChild(head);
  wrap.appendChild(body);
  return wrap;
}

/* =========================================================
   TRY IT  (per-parameter inputs that live-update the call)
   ========================================================= */
function buildTryIt(ep) {
  const box = el("div", "tryit");
  box.appendChild(el("div", "block-label", `${icon("zap", 13)} Try it`));

  const { pathVals, queryVals } = parseExample(ep);

  // Derive body field definitions (fall back to sampleBody keys when no body[] table exists)
  let bodyDefs = ep.body;
  if (!bodyDefs && ep.sampleBody) {
    bodyDefs = Object.keys(ep.sampleBody).map(k => {
      const v = ep.sampleBody[k];
      const t = Array.isArray(v) ? "string[]" : typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : "string";
      return [k, t, false, ""];
    });
  }
  const hasBody = ["POST", "PUT"].includes(ep.method) && bodyDefs && bodyDefs.length > 0;

  // Only offer interactive inputs for simple query params (skip illustrative ones like {field}[operator])
  const usableQuery = (ep.query || []).filter(q => /^[a-zA-Z0-9_]+$/.test(q[0]));

  const inputs = []; // { name, type, kind, inp }
  const fields = el("div", "fields");

  function addGroup(label, defs, kind, defaults) {
    if (!defs || !defs.length) return;
    fields.appendChild(el("div", "field-label", label));
    const grid = el("div", "field-grid");
    defs.forEach(([name, type, req, desc]) => {
      const nm = el("div", "field-name", `<span class="fn mono">${esc(name)}</span>${req ? '<span class="req">*</span>' : ''}`);
      const inp = el("input", "field-in"); inp.type = "text"; inp.placeholder = type;
      inp.value = (defaults && defaults[name] != null) ? defaults[name] : "";
      inp.dataset.kind = kind; inp.title = desc || "";
      inp._name = name; inp._type = type; inp._kind = kind;
      inp.addEventListener("input", rebuild);
      inputs.push({ name, type, kind, inp });
      grid.appendChild(nm); grid.appendChild(inp);
    });
    fields.appendChild(grid);
  }

  const bodyDefaults = {};
  if (bodyDefs) bodyDefs.forEach(([name]) => { if (ep.sampleBody && ep.sampleBody[name] !== undefined) bodyDefaults[name] = fmtVal(ep.sampleBody[name]); });

  addGroup("Path parameters", ep.params, "path", pathVals);
  addGroup("Query parameters", usableQuery, "query", queryVals);
  if (hasBody) addGroup("Body", bodyDefs, "body", bodyDefaults);

  // Auth token (auto-filled on sign in, shared across every panel)
  fields.appendChild(el("div", "field-label", `${icon("key", 13)} Auth token`));
  const tokGrid = el("div", "field-grid");
  const tokName = el("div", "field-name", `<span class="fn mono">Bearer</span>`);
  const tokIn = el("input", "field-in tok-in"); tokIn.type = "text";
  tokIn.placeholder = "auto-filled when you sign in, or paste a JWT";
  tokIn.value = currentToken();
  tokGrid.appendChild(tokName); tokGrid.appendChild(tokIn);
  fields.appendChild(tokGrid);

  box.appendChild(fields);

  // Request line (live preview + send)
  const reqLine = el("div", "req-line");
  reqLine.appendChild(el("span", `method m-${ep.method}`, ep.method));
  const urlPreview = el("input", "url-in url-preview"); urlPreview.type = "text"; urlPreview.readOnly = true;
  const send = el("button", "btn-send", "Send"); send.type = "button";
  reqLine.appendChild(urlPreview); reqLine.appendChild(send);
  box.appendChild(reqLine);

  // Generated body preview
  let bodyPre = null;
  if (hasBody) {
    box.appendChild(el("div", "block-label", "Request body (generated)"));
    const pbox = el("div", "codebox");
    bodyPre = el("pre", "mono");
    const cbtn = el("button", "copy", "Copy");
    cbtn.onclick = () => navigator.clipboard.writeText(JSON.stringify(buildBodyObj(), null, 2)).then(() => { cbtn.textContent = "Copied!"; setTimeout(() => cbtn.textContent = "Copy", 1200); });
    pbox.appendChild(cbtn); pbox.appendChild(bodyPre);
    box.appendChild(pbox);
  }

  const resp = el("div", "resp");
  box.appendChild(resp);

  if (ep.formData) {
    box.appendChild(el("div", "hint", "Photo upload uses multipart/form-data and can't be sent from this console. Use curl or Postman with a real file."));
  }

  function buildUrl() {
    let path = ep.path;
    inputs.filter(i => i.kind === "path").forEach(i => {
      const v = i.inp.value.trim();
      path = path.replace(new RegExp(":" + i.name + "\\b"), v ? encodeURIComponent(v) : (":" + i.name));
    });
    const qs = inputs.filter(i => i.kind === "query" && i.inp.value.trim() !== "")
      .map(i => `${encodeURIComponent(i.name)}=${encodeURIComponent(i.inp.value.trim())}`).join("&");
    return BASE + path + (qs ? "?" + qs : "");
  }

  function buildBodyObj() {
    const obj = {};
    inputs.filter(i => i.kind === "body").forEach(i => {
      const v = i.inp.value;
      if (v.trim() === "") return;
      obj[i.name] = coerce(v, i.type);
    });
    return obj;
  }

  function rebuild() {
    urlPreview.value = buildUrl();
    if (bodyPre) bodyPre.innerHTML = highlightJSON(buildBodyObj());
  }
  rebuild();

  send.onclick = async () => {
    resp.className = "resp show";
    resp.innerHTML = `<div class="hint">Sending…</div>`;
    send.disabled = true;
    const opts = { method: ep.method, headers: {} };
    const tok = tokIn.value.trim();
    if (tok) opts.headers["Authorization"] = "Bearer " + tok;
    if (hasBody) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(buildBodyObj());
    }
    const t0 = performance.now();
    try {
      const r = await fetch(urlPreview.value, opts);
      const dt = Math.round(performance.now() - t0);
      const ct = r.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await r.json() : await r.text();
      const cls = r.status < 300 ? "s2" : (r.status < 500 ? "s4" : "s5");
      resp.innerHTML = `<div class="status"><span class="code ${cls}">${r.status} ${esc(r.statusText)}</span> <span style="color:var(--text-faint);font-weight:500">${dt} ms</span></div>`;
      resp.appendChild(codeBlock(
        typeof payload === "string" ? esc(payload) : highlightJSON(payload),
        typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)));
    } catch (err) {
      resp.innerHTML = `<div class="status"><span class="code s5">Network error</span></div><div class="hint">${esc(err.message)}. Is the server running and reachable from this origin?</div>`;
    } finally {
      send.disabled = false;
    }
  };

  return box;
}

/* =========================================================
   BUILD SECTIONS + NAV
   ========================================================= */
const sectionsEl = document.getElementById("sections");
const navEl = document.getElementById("nav");
let totalEndpoints = 0;

GROUPS.forEach(group => {
  totalEndpoints += group.endpoints.length;

  const ng = el("div", "nav-group");
  ng.appendChild(el("div", "nav-label", `${icon(group.icon, 13)}<span>${esc(group.name)}</span>`));
  group.endpoints.forEach(ep => {
    const id = slug(ep.method, ep.path);
    const link = el("a", "nav-link"); link.href = "#" + id; link.dataset.target = id;
    link.dataset.search = (ep.method + " " + ep.path + " " + ep.summary).toLowerCase();
    link.innerHTML = `<span class="m m-${ep.method}">${ep.method}</span><span class="lbl">${esc(ep.summary)}</span>`;
    link.onclick = (e) => { e.preventDefault(); openAndScroll(id); document.body.classList.remove("nav-open"); };
    ng.appendChild(link);
  });
  navEl.appendChild(ng);

  const sec = el("section", "section"); sec.id = "sec-" + group.id;
  const sh = el("div", "section-head");
  sh.innerHTML = `<h3>${icon(group.icon, 20)}<span>${esc(group.name)}</span></h3><p>${esc(group.blurb)}</p>`;
  sec.appendChild(sh);
  group.endpoints.forEach(ep => sec.appendChild(buildEndpoint(ep)));
  sectionsEl.appendChild(sec);
});

document.getElementById("stat-ep").textContent = totalEndpoints;
document.getElementById("year").textContent = new Date().getFullYear();

function openAndScroll(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("open");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", "#" + id);
}

if (location.hash) {
  const id = location.hash.slice(1);
  setTimeout(() => openAndScroll(id), 60);
}

/* =========================================================
   SEARCH
   ========================================================= */
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".endpoint").forEach(ep => {
    ep.style.display = !q || ep.dataset.search.includes(q) ? "" : "none";
  });
  document.querySelectorAll(".nav-link").forEach(l => {
    l.style.display = !q || l.dataset.search.includes(q) ? "" : "none";
  });
  document.querySelectorAll(".section").forEach(s => {
    const anyVisible = [...s.querySelectorAll(".endpoint")].some(e => e.style.display !== "none");
    s.style.display = anyVisible ? "" : "none";
  });
  document.querySelectorAll(".nav-group").forEach(g => {
    const anyVisible = [...g.querySelectorAll(".nav-link")].some(l => l.style.display !== "none");
    g.style.display = anyVisible ? "" : "none";
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== searchInput && !isTyping()) { e.preventDefault(); searchInput.focus(); }
  if (e.key === "Escape" && document.activeElement === searchInput) { searchInput.value = ""; searchInput.dispatchEvent(new Event("input")); searchInput.blur(); }
});
function isTyping() {
  const a = document.activeElement;
  return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
}

/* =========================================================
   SCROLL SPY
   ========================================================= */
const spyLinks = [...document.querySelectorAll(".nav-link")];
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      spyLinks.forEach(l => l.classList.toggle("active", l.dataset.target === id));
    }
  });
}, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
document.querySelectorAll(".endpoint").forEach(e => spyObserver.observe(e));

/* =========================================================
   NAV DRAWER (mobile)
   ========================================================= */
document.getElementById("menuBtn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
document.getElementById("overlay").addEventListener("click", () => document.body.classList.remove("nav-open"));

/* =========================================================
   AUTHENTICATION  (sign in -> token auto-fills every panel)
   ========================================================= */
function currentToken() { return sessionStorage.getItem("cv_token") || ""; }
let authName = sessionStorage.getItem("cv_name") || null;

const authBtn = document.getElementById("authBtn");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPass = document.getElementById("authPass");
const authErr = document.getElementById("authErr");

function applyTokenToFields(t) {
  document.querySelectorAll(".tok-in").forEach(f => { if (f.value !== t) f.value = t; });
}

function updateAuthUI() {
  const t = currentToken();
  if (t) {
    authBtn.classList.add("authed");
    authBtn.innerHTML = `${icon("user", 15)}<span>${esc(authName || "Signed in")}</span>${icon("logout", 15)}`;
    authBtn.title = "Sign out";
  } else {
    authBtn.classList.remove("authed");
    authBtn.innerHTML = `${icon("login", 15)}<span>Sign in</span>`;
    authBtn.title = "Sign in";
  }
}

function setToken(t, name) {
  if (t) sessionStorage.setItem("cv_token", t); else sessionStorage.removeItem("cv_token");
  if (name !== undefined) {
    authName = name;
    if (name) sessionStorage.setItem("cv_name", name); else sessionStorage.removeItem("cv_name");
  }
  applyTokenToFields(t);
  updateAuthUI();
}

function openAuth() { authErr.textContent = ""; authModal.classList.add("show"); setTimeout(() => authEmail.focus(), 50); }
function closeAuth() { authModal.classList.remove("show"); }

authBtn.addEventListener("click", () => {
  if (currentToken()) {
    fetch(BASE + "/auth/logout", { headers: { Authorization: "Bearer " + currentToken() } }).catch(() => {});
    setToken("", null);
  } else {
    openAuth();
  }
});
document.getElementById("authClose").addEventListener("click", closeAuth);
authModal.addEventListener("click", e => { if (e.target === authModal) closeAuth(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && authModal.classList.contains("show")) closeAuth(); });

authForm.addEventListener("submit", async e => {
  e.preventDefault();
  authErr.textContent = "";
  const btn = authForm.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Signing in…";
  try {
    const r = await fetch(BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: authEmail.value.trim(), password: authPass.value }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.token) {
      authErr.textContent = (data && data.error) ? data.error : "Login failed (" + r.status + ")";
      return;
    }
    let name = null;
    try {
      const me = await fetch(BASE + "/auth/me", { headers: { Authorization: "Bearer " + data.token } });
      if (me.ok) { const md = await me.json(); name = md.data && md.data.name; }
    } catch (_) {}
    setToken(data.token, name || null);
    authPass.value = "";
    closeAuth();
  } catch (err) {
    authErr.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = "Sign in";
  }
});

// Manual token edits sync to every panel (delegated)
document.addEventListener("input", e => {
  const t = e.target;
  if (t.classList && t.classList.contains("tok-in")) {
    const v = t.value.trim();
    if (v) sessionStorage.setItem("cv_token", v); else sessionStorage.removeItem("cv_token");
    document.querySelectorAll(".tok-in").forEach(f => { if (f !== t && f.value !== v) f.value = v; });
    updateAuthUI();
  }
});

// Init auth state; resolve display name if we already hold a token
updateAuthUI();
if (currentToken() && !authName) {
  fetch(BASE + "/auth/me", { headers: { Authorization: "Bearer " + currentToken() } })
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d && d.data && d.data.name) { authName = d.data.name; sessionStorage.setItem("cv_name", authName); updateAuthUI(); } })
    .catch(() => {});
}

/* =========================================================
   THEME
   ========================================================= */
const sun = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`;
const moon = `<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>`;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.body.setAttribute("data-theme", t);
  themeIcon.innerHTML = t === "dark" ? sun : moon;
  localStorage.setItem("cv_theme", t);
}
applyTheme(localStorage.getItem("cv_theme") || "dark");
themeBtn.onclick = () => applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
