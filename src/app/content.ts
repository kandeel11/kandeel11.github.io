export interface Line {
  kind: 'fail' | 'fix' | 'pass';
  text: string;
}

export interface Shot {
  src: string;
  alt: string;
  caption: string;
}

export interface Case {
  id: string;
  name: string;
  context: string;
  highlight: string;
  tags: string;
  summary: string;
  problem: string;
  did: string[];
  story?: { caption: string; lines: Line[] };
  shots?: Shot[];
  shotsSource?: string;
  note?: string;
  stack: string;
  repo?: string;
  live?: string;
}

export interface Story {
  id: string;
  source: string;
  lines: Line[];
  caption: string;
}

export const heroStories: Story[] = [
  {
    id: 'cors',
    source: 'TrackManagement',
    lines: [
      { kind: 'fail', text: 'GET /api/tracks  blocked by CORS policy' },
      { kind: 'fix', text: 'allow the Angular dev origin in a named CORS policy' },
      { kind: 'pass', text: 'GET /api/tracks  200 OK' },
    ],
    caption: 'The first time the API and its Angular client ran together. Each worked alone; together, every request failed.',
  },
  {
    id: 'admin',
    source: 'Khayat',
    lines: [
      { kind: 'fail', text: 'GET /api/admin/users  200 OK with a customer’s token' },
      { kind: 'fix', text: 'require the Admin role on every admin controller' },
      { kind: 'pass', text: 'GET /api/admin/users  403 Forbidden for a customer' },
    ],
    caption: 'On the live app, the admin endpoints answered anyone. The right result here is a refusal.',
  },
  {
    id: 'deadline',
    source: 'Kama Kan',
    lines: [
      { kind: 'fail', text: 'paid 09:59:30, deadline 10:00:00, booking expired' },
      { kind: 'fix', text: 'judge a verified payment by when it was received' },
      { kind: 'pass', text: 'paid 09:59:30, deadline 10:00:00, booking confirmed' },
    ],
    caption: 'A worker applied payments a few seconds late and judged them by the current time, so on-time payers could lose the booking.',
  },
  {
    id: 'isrc',
    source: 'TrackManagement',
    lines: [
      { kind: 'fail', text: 'POST /api/tracks  isrc "eg-weg-24-00001"  rejected' },
      { kind: 'fix', text: 'normalize the code inside the Isrc value object' },
      { kind: 'pass', text: 'POST /api/tracks  201 Created  EGWEG2400001' },
    ],
    caption: 'The validator accepted dashes and lowercase; the domain didn’t. Valid input passed validation, then failed.',
  },
];

export const work: Case[] = [
  {
    id: 'kama-kan',
    name: 'Kama Kan',
    context: 'Appssquare, in development, 2026',
    highlight: 'I own 4 of its 7 modules, and found 3 payment bugs before release.',
    tags: '.NET 10, DDD, modular monolith, SQL Server',
    summary:
      'A property inspection platform for Saudi Arabia. A certified inspector documents a home before a tenant moves in and after they leave, so landlord and tenant share a neutral record of who is responsible for damage. The name means “as it was.”',
    problem:
      'Two developers had to build accounts, properties, inspections, payments and contracts in parallel without stepping on each other, and money had to move correctly even when the payment gateway was slow or failing.',
    did: [
      'Designed it with my teammate as a modular monolith: seven modules, each with its own database schema, talking only through shared interfaces. A test fails the build if one module references another.',
      'Own four of the modules: Identity, Properties, Rental Contracts and Payments.',
      'Built Identity: phone sign-up with SMS codes, refresh tokens that detect a stolen token being reused, and role checks against the account’s live status, so a suspended user is blocked on their next request.',
      'Reviewed the payments module before release by breaking its money rules one at a time and checking whether a test caught each break. That found three real bugs, all fixed and covered by tests.',
    ],
    story: {
      caption:
        'One of the three. A background worker applied payments every few seconds and judged them by the current time, so an owner who paid just before the deadline could lose the booking.',
      lines: [
        { kind: 'fail', text: 'paid 09:59:30, deadline 10:00:00, booking expired' },
        { kind: 'fix', text: 'apply a verified payment at once, judged by when it was received' },
        { kind: 'pass', text: 'paid 09:59:30, deadline 10:00:00, booking confirmed' },
      ],
    },
    note: '7 modules, 4 of them mine, 1,278 automated tests.',
    stack: '.NET 10, ASP.NET Core, EF Core, SQL Server, MediatR, xUnit, Docker',
  },
  {
    id: 'khayat',
    name: 'Khayat',
    context: 'Appssquare, live in production, 2026',
    highlight: 'Locked down every admin endpoint and fixed the bugs QA was reporting on the live app.',
    tags: '.NET 9, CQRS, Hangfire, Linux',
    summary:
      'A tailoring marketplace in Saudi Arabia that connects customers with tailors, and with fitters who visit customers at home to take measurements.',
    problem:
      'The app was already live, and QA was reporting bugs faster than anyone could tell which ones were in the backend and which were in the mobile app.',
    did: [
      'Traced each QA ticket through the real backend flow before touching code. Of seven tickets, three were backend bugs that I fixed; the other four came from the mobile app not refreshing or not clearing saved data, and I sent the mobile team the evidence.',
      'Found that every admin endpoint was open to anyone because its authorization attribute had been commented out. I enforced the Admin role on all of them, checked the live accounts first, then fixed the admin login and token refresh the new rule had locked out.',
      'Added admin controls to activate and suspend accounts, and blocked deleting a user who still has a wallet balance or open orders.',
      'Fixed sign-up and login failing with a server error whenever the SMS provider couldn’t deliver a code.',
      'Made validation errors come back in Arabic or English to match the app’s language, with one change in the request pipeline instead of editing every validator.',
    ],
    stack: '.NET 9, ASP.NET Core, EF Core, SQL Server, MediatR, Hangfire, Serilog, Linux',
  },
];

export const projects: Case[] = [
  {
    id: 'estateflow',
    name: 'EstateFlow AI',
    context: 'ITI graduation project, team of six, 2026',
    highlight: 'Rent through Stripe, leases read by OCR, and duplicate listings caught by vector search.',
    tags: '.NET 10, Angular, Redis, Azure, Semantic Kernel',
    summary:
      'A rental platform for landlords, tenants, brokers and property-management companies, covering listings, leases, rent, maintenance and disputes.',
    problem:
      'Six of us had to build nine connected areas during the ITI program without the code turning into one tangled project, and every rent payment had to reach the right wallet.',
    did: [
      'Nine modules with no direct references between them. They talk through MediatR and an outbox, so no event is lost if the server restarts.',
      'Rent paid through Stripe Checkout: 99% goes to the owner’s wallet and 1% is the platform fee.',
      'Azure Document Intelligence reads an uploaded lease and pulls out its start and end dates.',
      'Vector search with Qdrant flags a new listing that looks like a duplicate, an n8n workflow with an LLM decides who is responsible for each maintenance ticket, and a Semantic Kernel assistant answers questions about a property.',
      'Redis caching, live notifications over SignalR, and deployment to Azure through GitHub Actions.',
    ],
    shots: [
      {
        src: 'shots/estateflow-home.webp',
        alt: 'EstateFlow public home page with a property search box and type and bedroom filters',
        caption: 'The public site. The search box on the home page accepts plain-language queries.',
      },
      {
        src: 'shots/estateflow-market.webp',
        alt: 'Admin market trends page showing average rent, active listings and a rent trend chart',
        caption: 'Admin market trends: average rent, active listings and price per square metre.',
      },
      {
        src: 'shots/estateflow-ai.webp',
        alt: 'Admin AI insights chat with suggested questions about revenue, properties, users and subscriptions',
        caption: 'The admin analytics assistant, with suggested questions about the platform’s own data.',
      },
    ],
    stack: '.NET 10, Angular, SQL Server, Redis, Stripe, Semantic Kernel, Qdrant, n8n, Azure',
    repo: 'https://github.com/kandeel11/Real-Estate-ITI-Graduation-Project',
  },
  {
    id: 'vortex',
    name: 'Vortex',
    context: 'Team of three, 2026',
    highlight: 'Customers, sellers and admins each get their own app area, with Stripe and PayPal checkout.',
    tags: '.NET 10, SignalR, Angular 21',
    summary:
      'An online marketplace where customers shop, sellers run their own stores, and admins manage the platform.',
    problem: 'Three kinds of users need completely different screens and permissions from one codebase.',
    did: [
      'An Angular 21 app where login sends each role to its own area, an admin dashboard, a seller store or the shop, protected by route guards.',
      'Checkout with Stripe or PayPal. An order is marked paid only after Stripe’s signed webhook or a confirmed PayPal capture, not on the browser redirect.',
      'Earnings and product charts for sellers; admins manage customers, sellers, products, categories, banners and promo codes.',
      'A live admin inbox and real-time charts over SignalR, and login with email, Google or Facebook, with the token kept in an HttpOnly cookie.',
    ],
    shots: [
      {
        src: 'shots/vortex-catalog.webp',
        alt: 'Vortex product catalog with category and price filters and a grid of products',
        caption: 'The shop: category and price filters over products from two seller stores.',
      },
      {
        src: 'shots/vortex-seller.webp',
        alt: 'Seller dashboard with monthly revenue line chart and orders-by-status doughnut chart',
        caption: 'A seller’s dashboard: monthly revenue, orders by status and top products.',
      },
      {
        src: 'shots/vortex-admin.webp',
        alt: 'Admin overview with platform counts and monthly sales chart',
        caption: 'Admin overview: customers, sellers, orders and revenue across the whole platform.',
      },
      {
        src: 'shots/vortex-admin-products.webp',
        alt: 'Admin products table listing each product with category, seller, price, stock and status',
        caption: 'Admin product table across every seller, with stock and status.',
      },
    ],
    stack: '.NET 10, EF Core, SQL Server, MediatR, ASP.NET Identity, SignalR, Angular 21',
    repo: 'https://github.com/kandeel11/AngularProject',
  },
  {
    id: 'ecobazar',
    name: 'EcoBazar',
    context: 'ITI client-side track, team of five, team lead, 2026',
    highlight: 'A grocery store for customers, sellers and admins that runs entirely in the browser.',
    tags: 'JavaScript, OOP, Bootstrap, Chart.js',
    summary:
      'An organic grocery store where customers shop and review products, sellers manage stock and orders, and admins oversee users, sellers and sales.',
    problem:
      'The track allowed client-side code only, so stock, orders, carts and reviews had to work with no server or database, and five of us had about a month to build it without overwriting each other’s work.',
    did: [
      'Led the five-person team: split the work by page and role, and every change went in through a feature branch and a pull request.',
      'localStorage acts as the database, with every read and write going through one storage service, so a cart or wishlist change in one tab shows up in the others.',
      'Customer, Seller and Admin are ES6 classes built on one User base class with private fields.',
      'Each product in an order has its own status, so an order can be partly completed, and a cancellation by the customer or the seller puts the stock back.',
      'Seller pages for products and orders, an admin panel with Chart.js charts, and reviews limited to one per customer per product.',
    ],
    shots: [
      {
        src: 'shots/ecobazar-catalog.webp',
        alt: 'EcoBazar product catalog with category counts, price filter and organic product cards',
        caption: 'The shop: 70 seeded products across seven categories, with search, filters and sorting.',
      },
      {
        src: 'shots/ecobazar-home.webp',
        alt: 'EcoBazar home page with a hero banner and promotional tiles',
        caption: 'The home page, which also seeds the products and demo users on the first visit.',
      },
      {
        src: 'shots/ecobazar-details.webp',
        alt: 'Product details page for organic bananas with price, discount, quantity and add to cart',
        caption: 'Product details: discount, stock status, quantity limited by stock, and review tabs.',
      },
      {
        src: 'shots/ecobazar-seller.webp',
        alt: 'Seller dashboard listing the seller’s products with price, stock and edit and delete actions',
        caption: 'A seller’s dashboard with their own products, stock levels and orders.',
      },
    ],
    shotsSource: 'Shop screens from the live site; the seller dashboard from a local run of the same code.',
    stack: 'JavaScript (ES6 modules), HTML, CSS, Bootstrap 5, Chart.js',
    repo: 'https://github.com/kandeel11/CST-E-commerce-Project',
    live: 'https://kandeel11.github.io/CST-E-commerce-Project/',
  },
  {
    id: 'track-management',
    name: 'TrackManagement',
    context: 'Personal project, 2026',
    highlight: 'Tracks can only move through the release steps in order, enforced by the domain model.',
    tags: '.NET 10, DDD, JWT, Angular',
    summary:
      'A backend and Angular client that lets a music distributor manage artists and tracks and send tracks to streaming platforms.',
    problem:
      'A track has to move through Draft, Submitted and Distributed in that order, and distribution is the one step that reaches outside systems, so a mistake there is expensive.',
    did: [
      'Put the rules inside the domain model. A track’s status changes only through Submit() and Distribute(), which refuse invalid moves, so no controller or service can skip a step.',
      'Made the ISRC code a value object that normalizes and validates itself, so an invalid code can’t exist anywhere in the system.',
      'Protected only the distribute endpoint with JWT and its own policy, because it’s the only action with an outside effect.',
      'Built the Angular client with filters by artist, genre and status.',
    ],
    story: {
      caption:
        'The API validator accepted dashes and lowercase letters, but the domain accepted only the compact uppercase form, so valid input passed validation and then failed. Now the value object normalizes the code itself.',
      lines: [
        { kind: 'fail', text: 'POST /api/tracks  isrc "eg-weg-24-00001"  rejected by the domain' },
        { kind: 'fix', text: 'normalize inside the Isrc value object, one source of truth' },
        { kind: 'pass', text: 'POST /api/tracks  201 Created  isrc EGWEG2400001' },
      ],
    },
    shots: [
      {
        src: 'shots/trackmanagement-list.webp',
        alt: 'Track list with filters for artist, genre and status, and a status badge on each track',
        caption: 'The catalog, filtered by artist, genre and status, with each track’s step in the release flow.',
      },
      {
        src: 'shots/trackmanagement-detail.webp',
        alt: 'Track details showing the normalized ISRC, genre, release date and a table of distributions per platform',
        caption: 'One track: the ISRC as the value object stores it, and where it went live or was rejected.',
      },
    ],
    stack: '.NET 10, EF Core, SQL Server, FluentValidation, JWT, Angular',
    repo: 'https://github.com/kandeel11/TrackManagment',
  },
  {
    id: 'floor-plan',
    name: 'Floor Plan Generator',
    context: 'B.Sc. graduation project, 2024',
    highlight: 'Give it the outer walls of an apartment and it lays out the rooms and the walls between them.',
    tags: 'Python, PyTorch, ResNet-34, DeepLab',
    summary:
      'A deep-learning pipeline that takes an apartment’s outer boundary and front door and returns a 2D floor plan with rooms and interior walls.',
    problem:
      'The first layout of an apartment is drawn by hand inside walls that are already fixed. We wanted a model to propose that layout from the boundary alone, room by room, the way a designer would.',
    did: [
      'Turned the input, a polygon of the outer walls plus the door position and area, into the 256-pixel boundary and inside masks the networks train on.',
      'Split the work across four networks: one places the living room, one decides whether another room fits or the plan is done, one predicts where each room type goes, and one predicts the interior walls.',
      'Built the networks on ResNet-34, with DeepLab-style dilated convolutions for the location and wall maps.',
      'Turned the predicted wall map into clean straight wall lines, merging and snapping pieces that are almost aligned.',
    ],
    shots: [
      {
        src: 'shots/floorplan-boundary.webp',
        alt: 'An empty apartment outline on the left and the generated 2D floor plan with labelled rooms on the right',
        caption: 'What the project does: the outer boundary goes in, a 2D plan with rooms and walls comes out.',
      },
      {
        src: 'shots/floorplan-wall-model.webp',
        alt: 'Wall model slide showing boundary, inside, room and wall masks from the dataset next to the network layers',
        caption: 'The training data for one plan: boundary, inside, room and wall masks, next to the wall network.',
      },
      {
        src: 'shots/floorplan-living-model.webp',
        alt: 'Living model slide with boundary and inside masks and a ResNet-34 network that outputs a 2D coordinate',
        caption: 'The living-room network reads the boundary and inside masks and returns one point: where the living room goes.',
      },
      {
        src: 'shots/floorplan-continue-model.webp',
        alt: 'Continue model slide with the room mask and a network that outputs continue or terminate',
        caption: 'The continue network looks at the rooms placed so far and decides whether to add another one.',
      },
      {
        src: 'shots/floorplan-location-model.webp',
        alt: 'Location model slide with a DeepLab ASPP network that outputs a prediction map per room type',
        caption: 'The location network predicts a map of where each room type should go.',
      },
      {
        src: 'shots/floorplan-outputs.webp',
        alt: 'Six generated plans, each a black apartment shape with green interior walls',
        caption: 'Plans the trained models produced: the apartment in black, the predicted interior walls in green.',
      },
    ],
    shotsSource: 'Images from the project’s README on GitHub.',
    stack: 'Python, PyTorch, ResNet-34, DeepLab-ASPP, OpenCV, NumPy',
    repo: 'https://github.com/kandeel11/floorplan-AI-GP',
  },
];

export const skills = [
  { group: 'Backend', items: 'C#, .NET 10 and 9, ASP.NET Core Web API and MVC, EF Core, LINQ, SignalR, FluentValidation, JWT, ASP.NET Identity' },
  { group: 'Architecture', items: 'Clean Architecture, modular monolith, domain-driven design, CQRS with MediatR, outbox pattern, SOLID' },
  { group: 'Frontend', items: 'Angular, TypeScript, RxJS, Signals, HTML, CSS, Bootstrap' },
  { group: 'Data', items: 'SQL Server, T-SQL, query tuning and indexing, Redis' },
  { group: 'Testing', items: 'xUnit, NUnit, Moq, integration tests, contract tests, architecture tests' },
  { group: 'Cloud and tools', items: 'Azure, Docker, GitHub Actions, Linux servers, Git, Postman' },
  { group: 'AI', items: 'Semantic Kernel, RAG, Qdrant, Azure Document Intelligence, n8n' },
];

export const timeline = [
  { when: 'Sep 2026 to now', what: 'Backend .NET developer (intern), Appssquare' },
  { when: 'Jan to Jun 2026', what: 'Full Stack .NET program, ITI Tanta' },
  { when: 'Nov 2024 to Dec 2025', what: 'Military service, studied .NET and Angular on my own' },
  { when: 'May to Oct 2024', what: 'AI model trainer (freelance), Outlier' },
  { when: 'Jul to Aug 2023', what: '.NET backend summer camp, ITI Mansoura' },
  { when: '2019 to 2024', what: 'B.Sc. Computer and Control Engineering, ranked 2nd in my class' },
];
