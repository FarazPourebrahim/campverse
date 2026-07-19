/* =========================================================
   CampVerse API — interactive documentation
   ========================================================= */
const BASE = "/api/v1";
const AUTH_NOTE = "Send the JWT as a Bearer token in the Authorization header, or rely on the httpOnly cookie set at login.";

const GROUPS = [
  {
    id: "bootcamps", name: "Bootcamps", emoji: "🎓",
    blurb: "Create and browse coding bootcamps. Supports field selection, sorting, pagination and operator-based filtering. A publisher may own only one bootcamp.",
    endpoints: [
      {
        method: "GET", path: "/bootcamps", access: "Public",
        summary: "List all bootcamps",
        desc: "Returns all bootcamps with their populated courses. Supports rich query features: filter by any field (with gt, gte, lt, lte, in operators), select specific fields, sort, and paginate. The response includes a pagination object with next/prev pages.",
        query: [
          ["select", "string", false, "Comma-separated fields to return, e.g. name,description"],
          ["sort", "string", false, "Field to sort by; prefix with - for descending, e.g. -averageCost. Defaults to -createdAt"],
          ["page", "number", false, "Page number (default 1)"],
          ["limit", "number", false, "Results per page (default 25)"],
          ["{field}[operator]", "any", false, "Filter operator, e.g. averageCost[lte]=10000 or careers[in]=Business"],
        ],
        example: "/bootcamps?averageCost[lte]=10000&select=name,averageCost&sort=name&page=1&limit=10",
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
          ["acceptGi", "boolean", false, "Accepts the GI Bill — defaults false"],
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
    id: "courses", name: "Courses", emoji: "📚",
    blurb: "Courses always belong to a bootcamp. Adding, updating or removing a course recalculates the parent bootcamp's average cost.",
    endpoints: [
      {
        method: "GET", path: "/courses", access: "Public",
        summary: "List all courses",
        desc: "Returns every course across all bootcamps, each populated with its parent bootcamp's name and description. Supports the same select / sort / page / limit query features as bootcamps.",
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
    id: "reviews", name: "Reviews", emoji: "⭐",
    blurb: "Ratings from 1–10 that feed a bootcamp's averageRating. Each user may leave at most one review per bootcamp.",
    endpoints: [
      {
        method: "GET", path: "/reviews", access: "Public",
        summary: "List all reviews",
        desc: "Returns every review, each populated with its bootcamp's name and description. Supports select / sort / page / limit.",
        example: "/reviews?sort=-rating&limit=5",
        response: { success: true, count: 3, pagination: {}, data: [ { _id: "5d7a514b5d2c12c7449be020", title: "Learned a ton!", rating: 9, bootcamp: { name: "Devworks Bootcamp" } } ] }
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
    id: "auth", name: "Authentication", emoji: "🔐",
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
        desc: "Update the authenticated user's name and/or email.",
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
    id: "users", name: "Users", emoji: "👤",
    blurb: "Admin-only user management. Every route in this group requires an authenticated admin.",
    endpoints: [
      {
        method: "GET", path: "/users", access: "Admin",
        summary: "List all users",
        desc: "Returns all users. Supports select / sort / page / limit. Admin only.",
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
   RENDERING HELPERS
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
    body.appendChild(el("div", null,
      `<div class="block-label" style="margin-top:0">Authorization</div>`+
      `<div style="font-size:13.5px;color:var(--text-dim)">🔒 Requires authentication${ep.roles ? ` · roles: <b style="color:var(--text)">${esc(ep.roles)}</b>` : ""}. ${AUTH_NOTE}</div>`));
  }

  if (ep.params)   { body.appendChild(el("div","block-label","Path Parameters")); body.appendChild(paramTable(ep.params, "Parameter")); }
  if (ep.query)    { body.appendChild(el("div","block-label","Query Parameters")); body.appendChild(paramTable(ep.query, "Parameter")); }
  if (ep.formData) { body.appendChild(el("div","block-label","Form Data (multipart)")); body.appendChild(paramTable(ep.formData, "Field")); }
  if (ep.body)     { body.appendChild(el("div","block-label","Request Body")); body.appendChild(paramTable(ep.body, "Field")); }

  if (ep.sampleBody) {
    body.appendChild(el("div","block-label","Example Request Body"));
    body.appendChild(codeBlock(highlightJSON(ep.sampleBody), JSON.stringify(ep.sampleBody, null, 2)));
  }

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

function buildTryIt(ep) {
  const box = el("div", "tryit");
  box.appendChild(el("div","block-label","🚀 Try it"));

  const row = el("div","row");
  row.appendChild(el("span", `method m-${ep.method}`, ep.method));
  const urlIn = el("input"); urlIn.type = "text"; urlIn.className = "url-in"; urlIn.value = BASE + ep.example;
  const send = el("button","btn-send","Send"); send.type = "button";
  row.appendChild(urlIn); row.appendChild(send);
  box.appendChild(row);

  const tokRow = el("div","row"); tokRow.style.marginTop = "8px";
  const tokIn = el("input"); tokIn.type = "text"; tokIn.className = "url-in";
  tokIn.placeholder = "🔑  Bearer token (optional — remembered for this tab)";
  tokIn.value = sessionStorage.getItem("cv_token") || "";
  tokIn.oninput = () => sessionStorage.setItem("cv_token", tokIn.value.trim());
  tokRow.appendChild(tokIn);
  box.appendChild(tokRow);

  let bodyIn = null;
  const hasBody = ["POST","PUT"].includes(ep.method) && ep.sampleBody;
  if (hasBody) {
    bodyIn = el("textarea"); bodyIn.value = JSON.stringify(ep.sampleBody, null, 2); bodyIn.spellcheck = false;
    box.appendChild(bodyIn);
  }

  const resp = el("div","resp");
  box.appendChild(resp);

  if (ep.formData) {
    box.appendChild(el("div","hint","Photo upload uses multipart/form-data and can't be sent from this console — use curl or Postman with a real file."));
  }

  send.onclick = async () => {
    resp.className = "resp show";
    resp.innerHTML = `<div class="hint">Sending…</div>`;
    send.disabled = true;
    const opts = { method: ep.method, headers: {} };
    const tok = tokIn.value.trim();
    if (tok) opts.headers["Authorization"] = "Bearer " + tok;
    if (hasBody && bodyIn) {
      try { JSON.parse(bodyIn.value); }
      catch (e) {
        resp.innerHTML = `<div class="status"><span class="code s4">Invalid JSON</span> Fix the request body and try again.</div>`;
        send.disabled = false; return;
      }
      opts.headers["Content-Type"] = "application/json";
      opts.body = bodyIn.value;
    }
    const t0 = performance.now();
    try {
      const r = await fetch(urlIn.value, opts);
      const dt = Math.round(performance.now() - t0);
      const ct = r.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await r.json() : await r.text();
      const cls = r.status < 300 ? "s2" : (r.status < 500 ? "s4" : "s5");
      resp.innerHTML = `<div class="status"><span class="code ${cls}">${r.status} ${esc(r.statusText)}</span> <span style="color:var(--text-faint);font-weight:500">${dt} ms</span></div>`;
      resp.appendChild(codeBlock(
        typeof payload === "string" ? esc(payload) : highlightJSON(payload),
        typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)));
    } catch (err) {
      resp.innerHTML = `<div class="status"><span class="code s5">Network error</span></div><div class="hint">${esc(err.message)} — is the server running and reachable from this origin?</div>`;
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

  const ng = el("div","nav-group");
  ng.appendChild(el("div","nav-label", `${group.emoji} ${group.name}`));
  group.endpoints.forEach(ep => {
    const id = slug(ep.method, ep.path);
    const link = el("a","nav-link"); link.href = "#" + id; link.dataset.target = id;
    link.dataset.search = (ep.method + " " + ep.path + " " + ep.summary).toLowerCase();
    link.innerHTML = `<span class="m m-${ep.method}">${ep.method}</span><span class="lbl">${esc(ep.summary)}</span>`;
    link.onclick = (e) => { e.preventDefault(); openAndScroll(id); document.body.classList.remove("nav-open"); };
    ng.appendChild(link);
  });
  navEl.appendChild(ng);

  const sec = el("section","section"); sec.id = "sec-" + group.id;
  const sh = el("div","section-head");
  sh.innerHTML = `<h3><span class="emoji">${group.emoji}</span> ${esc(group.name)}</h3><p>${esc(group.blurb)}</p>`;
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
  if (e.key === "/" && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
  if (e.key === "Escape" && document.activeElement === searchInput) { searchInput.value = ""; searchInput.dispatchEvent(new Event("input")); searchInput.blur(); }
});

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
