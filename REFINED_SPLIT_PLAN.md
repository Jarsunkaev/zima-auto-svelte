# Zima Auto - Website Breakdown Plan (REFINED)

## Executive Summary

This document outlines the plan to split the current monolithic Zima Auto website into three distinct frontend applications, each serving different service categories while maintaining a shared backend infrastructure. **This refined version accounts for the current architecture where the backend serves the frontend deployment.**

---

## Current Architecture Analysis

### Current Structure
- **Frontend**: Single Svelte application with all services
- **Backend**: Express.js server (zima-auto-backend)
- **Services**: 4 main services
  - Airport Parking (`airportParking`)
  - Car Wash (`carWash`)
  - Auto Service (`autoService`)
  - Tire Service (`tireService`)
- **Languages**: Bilingual (English/Hungarian)
- **Backend Endpoints**:
  - `/api/send-booking-emails` - Main booking endpoint
  - `/api/available-slots` - Time slot availability
  - `/api/send-contact-email` - Contact form
  - `/api/bookings` - Get bookings (admin)

### Current Deployment Architecture

**CRITICAL**: The backend currently serves the frontend from its `public/` directory:

1. **Frontend Build Process**:
   - Frontend is built using Rollup into `public/` directory
   - Build outputs: `public/build/bundle.js`, `public/build/bundle.css`, `public/index.html`

2. **Backend Serving Frontend**:
   - Backend `server.js` serves static files from `public/` directory (lines 1274-1302)
   - Backend has catch-all route serving `index.html` for SPA routing (lines 1305-1338)
   - Backend Dockerfile copies `public/` directory into container (line 9)

3. **Current Deployment Setup**:
   - Backend app: `zima-auto-backend` (Fly.io)
   - Frontend app: `zima-auto-frontend` (Fly.io) - separate deployment
   - Backend serves frontend at `zima-auto.com` and `www.zima-auto.com`
   - Backend also has API endpoints at `/api/*`

4. **Domain Configuration**:
   - `zima-auto.com` → Backend (serves frontend + API)
   - `www.zima-auto.com` → Backend (serves frontend + API)

---

## Proposed Architecture

### Three Frontend Applications

#### 1. **Main Landing Page** 
- **Domain**: `zima-auto.com` (existing)
- **Purpose**: Company overview, service summaries, navigation hub
- **Content**:
  - Hero section with company introduction
  - Service overview cards (all 4 services)
  - Links to specialized frontends
  - Company information
  - Contact information
  - Testimonials
  - Footer with links

#### 2. **Airport Parking & Car Wash Frontend**
- **Domain**: `zima-parking.com` or `zima-parkwash.com` (suggestions below)
- **Purpose**: Dedicated booking platform for parking and car wash services
- **Services**:
  - Airport Parking (24/7 service)
  - Car Wash (hand wash service)
- **Features**:
  - Service selection
  - Booking forms for both services
  - Pricing information
  - Availability calendar
  - Time slot selection

#### 3. **Car Maintenance & Tire Service Frontend**
- **Domain**: `zima-service.com` or `zima-workshop.com` (suggestions below)
- **Purpose**: Dedicated booking platform for maintenance and tire services
- **Services**:
  - Auto Service (maintenance/repairs)
  - Tire Service (tire fitting, repairs)
- **Features**:
  - Service selection
  - Booking forms for both services
  - Service type selection
  - Pricing information
  - Availability calendar (weekdays only, no Sundays)

---

## Proposed Deployment Architecture

### Option A: Backend Serves Landing Page Only (Recommended)

**Architecture**:
- **Backend** (`zima-auto-backend`):
  - Serves landing page frontend from `public/` directory
  - Provides all API endpoints at `/api/*`
  - Handles `zima-auto.com` domain
  
- **Parking Frontend** (`zima-parking-frontend`):
  - Separate Fly.io app deployment
  - Serves `zima-parking.com` domain
  - Calls backend API at `https://zima-auto-backend.fly.dev/api`
  
- **Service Frontend** (`zima-service-frontend`):
  - Separate Fly.io app deployment
  - Serves `zima-service.com` domain
  - Calls backend API at `https://zima-auto-backend.fly.dev/api`

**Pros**:
- Minimal changes to backend (only CORS + landing page frontend)
- Clear separation of concerns
- Each frontend can be deployed independently
- Landing page stays on main domain

**Cons**:
- Three separate deployments to manage
- Slightly more complex deployment pipeline

### Option B: All Frontends Deployed Separately

**Architecture**:
- **Backend** (`zima-auto-backend`):
  - API only (remove frontend serving)
  - Provides all API endpoints at `/api/*`
  - No static file serving
  
- **Landing Frontend** (`zima-auto-landing`):
  - Separate Fly.io app deployment
  - Serves `zima-auto.com` domain
  
- **Parking Frontend** (`zima-parking-frontend`):
  - Separate Fly.io app deployment
  - Serves `zima-parking.com` domain
  
- **Service Frontend** (`zima-service-frontend`):
  - Separate Fly.io app deployment
  - Serves `zima-service.com` domain

**Pros**:
- Complete separation of frontend and backend
- Backend is pure API
- All frontends treated equally

**Cons**:
- More significant backend changes (remove static serving)
- Four separate deployments
- More complex initial setup

**Recommendation**: **Option A** - Backend serves landing page only, other two frontends deployed separately.

---

## Domain Name Suggestions

### Option 1: Service-Based
- **Parking & Car Wash**: 
  - `zima-parking.com` ⭐ (Recommended - clear and simple)
  - `zima-parkwash.com`
  - `zima-parkandwash.com`
  
- **Maintenance & Tire Service**:
  - `zima-service.com` ⭐ (Recommended - professional)
  - `zima-workshop.com`
  - `zima-autoservice.com`

### Option 2: Location/Function-Based
- **Parking & Car Wash**:
  - `zima-airport.com`
  - `zima-parkwash.com`
  
- **Maintenance & Tire Service**:
  - `zima-garage.com`
  - `zima-repair.com`

### Option 3: Branded
- **Parking & Car Wash**:
  - `park-zima.com`
  - `wash-zima.com`
  
- **Maintenance & Tire Service**:
  - `service-zima.com`
  - `workshop-zima.com`

**Recommendation**: `zima-parking.com` and `zima-service.com` for clarity and brand consistency.

---

## Frontend Breakdown Details

### 1. Landing Page (zima-auto.com)

#### Pages/Components Needed:
- **Home Page** (`Home.svelte` - simplified)
  - Hero section
  - Service overview (4 cards with links)
  - Company introduction
  - Testimonials section
  - CTA sections linking to specialized sites
  
- **About Page** (`About.svelte` - keep as is)
- **Contact Page** (`Contact.svelte` - keep as is)
- **Privacy/Terms/Imprint** (keep as is)

#### Components to Keep:
- `Header.svelte` (modified - links to external sites)
- `Footer.svelte` (modified - links to external sites)
- `ServiceCard.svelte` (simplified - no booking, just info + external link)
- `TestimonialCard.svelte`
- `GoogleReviews.svelte`
- `CookieConsent.svelte`
- `DiscountPopup.svelte` (optional)

#### Components to Remove:
- `Booking.svelte` (entire page)
- `ServiceSelection.svelte`
- `AirportParkingForm.svelte`
- `CarWashForm.svelte`
- `AutoServiceForm.svelte`
- `TireServiceForm.svelte`
- `BookingConfirmation.svelte`
- `PriceCalculator.svelte`
- `TimeSlotSelector.svelte`
- `CustomDatePicker.svelte`

#### Routing:
- `/` - Home
- `/about` - About
- `/contact` - Contact
- `/privacy` - Privacy
- `/terms` - Terms
- `/imprint` - Imprint

---

### 2. Airport Parking & Car Wash Frontend (New Domain)

#### Pages/Components Needed:
- **Home Page** (simplified landing)
  - Hero section
  - Service overview (2 services only)
  - Quick booking CTA
  
- **Booking Page** (`Booking.svelte` - modified)
  - Service selection (only `airportParking` and `carWash`)
  - Forms for both services
  
- **Services Page** (`Services.svelte` - modified)
  - Only parking and car wash pricing/details
  
- **Contact Page** (`Contact.svelte` - keep as is)

#### Components to Keep:
- `Header.svelte` (modified)
- `Footer.svelte` (modified)
- `ServiceSelection.svelte` (modified - only 2 services)
- `AirportParkingForm.svelte`
- `CarWashForm.svelte`
- `BookingConfirmation.svelte`
- `PriceCalculator.svelte` (for parking)
- `TimeSlotSelector.svelte` (for car wash)
- `CustomDatePicker.svelte`
- `PersonalInfoForm.svelte`
- `LoadingSpinner.svelte`
- `CookieConsent.svelte`

#### Components to Remove:
- `AutoServiceForm.svelte`
- `TireServiceForm.svelte`
- Service cards for auto service and tire service

#### Routing:
- `/` - Home
- `/booking` - Booking
- `/services` - Services (pricing)
- `/contact` - Contact
- `/privacy` - Privacy
- `/terms` - Terms

---

### 3. Car Maintenance & Tire Service Frontend (New Domain)

#### Pages/Components Needed:
- **Home Page** (simplified landing)
  - Hero section
  - Service overview (2 services only)
  - Quick booking CTA
  
- **Booking Page** (`Booking.svelte` - modified)
  - Service selection (only `autoService` and `tireService`)
  - Forms for both services
  
- **Services Page** (`Services.svelte` - modified)
  - Only auto service and tire service pricing/details
  
- **Contact Page** (`Contact.svelte` - keep as is)

#### Components to Keep:
- `Header.svelte` (modified)
- `Footer.svelte` (modified)
- `ServiceSelection.svelte` (modified - only 2 services)
- `AutoServiceForm.svelte`
- `TireServiceForm.svelte`
- `BookingConfirmation.svelte`
- `TimeSlotSelector.svelte`
- `CustomDatePicker.svelte`
- `PersonalInfoForm.svelte`
- `LoadingSpinner.svelte`
- `CookieConsent.svelte`

#### Components to Remove:
- `AirportParkingForm.svelte`
- `CarWashForm.svelte`
- `PriceCalculator.svelte`
- Service cards for parking and car wash

#### Routing:
- `/` - Home
- `/booking` - Booking
- `/services` - Services (pricing)
- `/contact` - Contact
- `/privacy` - Privacy
- `/terms` - Terms

---

## Shared Components & Assets

### Components to Share Across All Frontends:
- `CookieConsent.svelte`
- `LoadingSpinner.svelte`
- `PersonalInfoForm.svelte` (if used in multiple forms)

### Assets to Share:
- All images in `/public/images/`
- Logo files
- Favicon
- Flags for language switcher

### Libraries to Share:
- i18n system (`src/lib/i18n/`)
- Translation files (`en.js`, `hu.js`, `booking-content.js`)
- Global styles (`global.css`)

---

## Backend Modifications Required

### 1. CORS Configuration
**File**: `zima-auto-backend/server.js`

**Current CORS Origins** (lines 103-113):
```javascript
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.zima-auto.com',
  'https://zima-auto.com',
  'https://zima-auto-frontend.fly.dev',
  'https://zima-auto-backend.fly.dev',
  'https://zima-auto-admin.fly.dev'
];
```

**Updated CORS Origins** (add new domains):
```javascript
const allowedOrigins = [
  // Development
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://localhost:3001',
  
  // Main landing page (served by backend)
  'https://www.zima-auto.com',
  'https://zima-auto.com',
  
  // Airport Parking & Car Wash frontend
  'https://www.zima-parking.com',
  'https://zima-parking.com',
  // Alternative: 'https://www.zima-parkwash.com',
  // Alternative: 'https://zima-parkwash.com',
  
  // Car Maintenance & Tire Service frontend
  'https://www.zima-service.com',
  'https://zima-service.com',
  // Alternative: 'https://www.zima-workshop.com',
  // Alternative: 'https://zima-workshop.com',
  
  // Legacy/Backend
  'https://zima-auto-frontend.fly.dev',
  'https://zima-auto-backend.fly.dev',
  'https://zima-auto-admin.fly.dev'
];
```

### 2. Frontend Serving (Option A - Recommended)

**If using Option A (Backend serves landing page only)**:

The backend will continue to serve the landing page frontend from `public/` directory. No changes needed to the static file serving logic (lines 1274-1338), but:

1. **Update Dockerfile** to build landing page frontend:
   ```dockerfile
   # Build landing page frontend
   COPY zima-auto-landing/package*.json ./landing/
   WORKDIR /app/landing
   RUN npm install --legacy-peer-deps
   COPY zima-auto-landing/ ./
   RUN npm run build
   
   # Copy built frontend to backend public directory
   WORKDIR /app
   COPY --from=landing-build /app/landing/public ./public
   ```

   OR simpler approach: Build landing page separately and copy `public/` directory into backend before deployment.

2. **No changes to server.js** static serving logic needed - it already handles SPA routing correctly.

### 3. Frontend Serving (Option B - All Separate)

**If using Option B (All frontends separate)**:

Remove frontend serving from backend:

1. **Remove static file serving** (lines 1274-1302):
   - Remove `app.use(express.static(publicPath, ...))`
   - Keep only API routes

2. **Remove SPA catch-all route** (lines 1305-1338):
   - Remove the `app.get('*', ...)` handler
   - Add 404 handler for non-API routes if needed

3. **Update Dockerfile**:
   - Remove `COPY public/ ./public/` line
   - Backend becomes API-only

4. **Update fly.toml**:
   - Remove domain configuration (domains will point to frontend apps)

**Recommendation**: Use Option A to minimize changes.

### 4. No Other Backend Changes Required
- All existing endpoints remain the same
- Service type filtering happens on frontend
- Backend already handles all service types correctly

---

## Implementation Steps

### Phase 1: Preparation
1. ✅ Analyze current codebase (COMPLETED)
2. ⏳ Register new domains (`zima-parking.com`, `zima-service.com`)
3. ⏳ Set up DNS records for new domains
4. ⏳ Create separate repositories/folders for each frontend
5. ⏳ Set up Fly.io apps for new frontends

### Phase 2: Landing Page (zima-auto.com)
1. Create new branch: `feature/landing-page-only`
2. Remove booking-related components
3. Simplify Home page to show service overview with external links
4. Update Header/Footer navigation with links to specialized sites
5. Update API calls to use `VITE_BACKEND_API_URL` environment variable
6. Test all pages
7. Build frontend and copy `public/` to backend
8. Deploy backend (which serves landing page)

### Phase 3: Airport Parking & Car Wash Frontend
1. Create new repository/folder: `zima-parking-frontend`
2. Copy base Svelte structure
3. Remove auto service and tire service components
4. Modify ServiceSelection to show only 2 services
5. Update routing
6. Update Header/Footer with links to main site
7. Configure build for new domain
8. Set `VITE_BACKEND_API_URL=https://zima-auto-backend.fly.dev/api`
9. Create `fly.toml` for new app
10. Test booking flow
11. Deploy to Fly.io as `zima-parking-frontend`
12. Configure domain `zima-parking.com` to point to new app

### Phase 4: Car Maintenance & Tire Service Frontend
1. Create new repository/folder: `zima-service-frontend`
2. Copy base Svelte structure
3. Remove parking and car wash components
4. Modify ServiceSelection to show only 2 services
5. Update routing
6. Update Header/Footer with links to main site
7. Configure build for new domain
8. Set `VITE_BACKEND_API_URL=https://zima-auto-backend.fly.dev/api`
9. Create `fly.toml` for new app
10. Test booking flow
11. Deploy to Fly.io as `zima-service-frontend`
12. Configure domain `zima-service.com` to point to new app

### Phase 5: Backend Updates
1. Update CORS configuration with new domains
2. Test API calls from all three domains
3. Verify email templates work correctly
4. Deploy backend updates

### Phase 6: Cross-Linking & SEO
1. Add proper links between all three sites
2. Update sitemaps for each domain
3. Configure robots.txt for each domain
4. Test cross-domain navigation
5. Verify analytics tracking

---

## File Structure After Split

### Option A Structure (Recommended):

```
zima-auto-svelte/
├── zima-auto-landing/          # Main landing page (built into backend public/)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.svelte      # Simplified
│   │   │   ├── About.svelte
│   │   │   ├── Contact.svelte
│   │   │   ├── Privacy.svelte
│   │   │   ├── Terms.svelte
│   │   │   └── Imprint.svelte
│   │   ├── components/
│   │   │   ├── Header.svelte    # Modified
│   │   │   ├── Footer.svelte     # Modified
│   │   │   ├── ServiceCard.svelte # Simplified
│   │   │   ├── TestimonialCard.svelte
│   │   │   └── CookieConsent.svelte
│   │   └── lib/
│   │       └── i18n/            # Shared
│   ├── public/
│   │   └── (assets)
│   ├── package.json
│   ├── rollup.config.js
│   └── Dockerfile (optional - for separate deployment if needed)
│
├── zima-parking-frontend/       # Parking & Car Wash (separate deployment)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.svelte
│   │   │   ├── Booking.svelte   # Modified
│   │   │   ├── Services.svelte  # Modified
│   │   │   └── Contact.svelte
│   │   ├── components/
│   │   │   ├── Header.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── ServiceSelection.svelte # Modified
│   │   │   ├── AirportParkingForm.svelte
│   │   │   ├── CarWashForm.svelte
│   │   │   ├── BookingConfirmation.svelte
│   │   │   ├── PriceCalculator.svelte
│   │   │   ├── TimeSlotSelector.svelte
│   │   │   ├── CustomDatePicker.svelte
│   │   │   └── PersonalInfoForm.svelte
│   │   └── lib/
│   │       └── i18n/            # Shared
│   ├── public/
│   ├── package.json
│   ├── rollup.config.js
│   ├── server.js
│   ├── Dockerfile
│   └── fly.toml
│
├── zima-service-frontend/      # Maintenance & Tire Service (separate deployment)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.svelte
│   │   │   ├── Booking.svelte   # Modified
│   │   │   ├── Services.svelte  # Modified
│   │   │   └── Contact.svelte
│   │   ├── components/
│   │   │   ├── Header.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── ServiceSelection.svelte # Modified
│   │   │   ├── AutoServiceForm.svelte
│   │   │   ├── TireServiceForm.svelte
│   │   │   ├── BookingConfirmation.svelte
│   │   │   ├── TimeSlotSelector.svelte
│   │   │   ├── CustomDatePicker.svelte
│   │   │   └── PersonalInfoForm.svelte
│   │   └── lib/
│   │       └── i18n/            # Shared
│   ├── public/
│   ├── package.json
│   ├── rollup.config.js
│   ├── server.js
│   ├── Dockerfile
│   └── fly.toml
│
└── zima-auto-backend/          # Shared backend (serves landing page + API)
    ├── server.js               # CORS update + serves landing page
    ├── public/                  # Landing page build output (copied from zima-auto-landing)
    ├── routes/
    │   └── bookings.js         # No changes needed
    ├── utils/
    ├── templates/
    ├── Dockerfile              # Updated to include landing page build
    └── fly.toml                # Domain: zima-auto.com
```

### Option B Structure (All Separate):

```
zima-auto-svelte/
├── zima-auto-landing/          # Main landing page (separate deployment)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── rollup.config.js
│   ├── server.js
│   ├── Dockerfile
│   └── fly.toml                # Domain: zima-auto.com
│
├── zima-parking-frontend/       # Parking & Car Wash (separate deployment)
│   └── (same as Option A)
│
├── zima-service-frontend/      # Maintenance & Tire Service (separate deployment)
│   └── (same as Option A)
│
└── zima-auto-backend/          # API only (no frontend serving)
    ├── server.js               # CORS update + removed static serving
    ├── routes/
    │   └── bookings.js         # No changes needed
    ├── utils/
    ├── templates/
    ├── Dockerfile              # No public/ directory
    └── fly.toml                # No domain config (API only)
```

---

## Technical Considerations

### Environment Variables

**Landing Page (served by backend)**:
- Uses backend's environment
- API calls use relative paths or `https://zima-auto-backend.fly.dev/api`

**Parking Frontend**:
```env
VITE_BACKEND_API_URL=https://zima-auto-backend.fly.dev/api
```

**Service Frontend**:
```env
VITE_BACKEND_API_URL=https://zima-auto-backend.fly.dev/api
```

### Build Configuration
- Each frontend will have its own `rollup.config.js`
- Each will build to its own `public/` directory
- Deployment targets will be different domains/apps

### API Integration
- All frontends will call the same backend endpoints
- Backend already handles service type filtering via `service` field
- No changes needed to API contracts
- All frontends use `VITE_BACKEND_API_URL` environment variable

### i18n System
- All three frontends will share the same i18n structure
- Translation files can be copied to each project
- Language preference can be stored in localStorage per domain

### Analytics
- Each domain should have its own analytics tracking
- Consider cross-domain tracking if needed

### Deployment Workflow (Option A)

**Landing Page**:
1. Build landing page: `cd zima-auto-landing && npm run build`
2. Copy `zima-auto-landing/public/` to `zima-auto-backend/public/`
3. Deploy backend: `fly deploy` (from backend directory)

**Parking Frontend**:
1. Build: `cd zima-parking-frontend && npm run build`
2. Deploy: `fly deploy` (from parking frontend directory)

**Service Frontend**:
1. Build: `cd zima-service-frontend && npm run build`
2. Deploy: `fly deploy` (from service frontend directory)

---

## Testing Checklist

### Landing Page (zima-auto.com)
- [ ] All service cards display correctly
- [ ] Links to specialized frontends work
- [ ] Language switcher works
- [ ] Contact form works
- [ ] All static pages load correctly
- [ ] Mobile responsive
- [ ] API calls work (if any)

### Airport Parking & Car Wash Frontend
- [ ] Only 2 services shown in selection
- [ ] Airport parking booking flow works
- [ ] Car wash booking flow works
- [ ] Time slot selection works (car wash)
- [ ] Price calculator works (parking)
- [ ] API calls to backend succeed
- [ ] Confirmation emails sent
- [ ] Language switcher works
- [ ] Mobile responsive
- [ ] Cross-domain links work

### Car Maintenance & Tire Service Frontend
- [ ] Only 2 services shown in selection
- [ ] Auto service booking flow works
- [ ] Tire service booking flow works
- [ ] Time slot selection works
- [ ] Sunday restriction works
- [ ] API calls to backend succeed
- [ ] Confirmation emails sent
- [ ] Language switcher works
- [ ] Mobile responsive
- [ ] Cross-domain links work

### Backend
- [ ] CORS allows all three domains
- [ ] All endpoints respond correctly
- [ ] Email templates work for all services
- [ ] Google Calendar integration works
- [ ] Google Sheets integration works
- [ ] Landing page serves correctly (Option A)

### Cross-Domain
- [ ] Navigation between sites works
- [ ] Links are correct
- [ ] No broken references
- [ ] Analytics tracking works across domains

---

## Migration Strategy

### Option 1: Big Bang (All at Once)
- Build all three frontends
- Update backend CORS
- Deploy all simultaneously
- **Risk**: High - if something breaks, everything breaks

### Option 2: Phased Rollout (Recommended)
1. **Week 1**: 
   - Deploy landing page only (remove booking from main site)
   - Update backend to serve new landing page
   - Test thoroughly
2. **Week 2**: 
   - Deploy parking & car wash frontend (test thoroughly)
   - Update backend CORS
3. **Week 3**: 
   - Deploy maintenance & tire service frontend (test thoroughly)
   - Final CORS update
4. **Week 4**: 
   - Monitor all three sites
   - Fix any issues
   - Update cross-links

### Option 3: Parallel Development
- Develop all three in parallel
- Test in staging environments
- Deploy when all are ready
- **Risk**: Medium - coordination needed

**Recommendation**: Option 2 (Phased Rollout) for safety and easier debugging.

---

## SEO Considerations

### Each Domain Should Have:
- Unique sitemap.xml
- Unique robots.txt
- Proper meta tags
- Canonical URLs
- Language alternates (hreflang tags)

### Cross-Domain Linking:
- Use proper anchor text
- Maintain internal link structure
- Consider rel="nofollow" for external service links if needed

---

## Maintenance Plan

### Code Sharing Strategy
1. **Option A**: Copy i18n files to each project (simplest)
2. **Option B**: Create shared npm package for i18n (more complex, better long-term)
3. **Option C**: Use git submodules (advanced)

**Recommendation**: Start with Option A, migrate to Option B if needed.

### Updates
- **Landing page**: Company info, testimonials, general updates → Update `zima-auto-landing`, rebuild, copy to backend, deploy backend
- **Parking/Car Wash**: Pricing, availability rules, form updates → Update `zima-parking-frontend`, deploy
- **Maintenance/Tire**: Pricing, service types, form updates → Update `zima-service-frontend`, deploy
- **Backend**: Shared updates affect all frontends → Update backend, deploy

---

## Cost Considerations

### Additional Costs:
- 2 new domain registrations (~$10-20/year each)
- SSL certificates (free with Let's Encrypt via Fly.io)
- Additional Fly.io app deployments (2 new apps)
  - Each app: ~$1.94/month for 256MB RAM (shared CPU)
  - Total: ~$3.88/month for 2 new apps
- Development time

### Savings:
- Better user experience (focused sites)
- Easier maintenance per service category
- Better SEO potential
- Clearer branding per service type

---

## Risk Assessment

### Low Risk:
- Backend changes (only CORS + optional static serving removal)
- Component reuse
- i18n system (already working)

### Medium Risk:
- Cross-domain navigation
- Analytics tracking
- SEO impact during transition
- Deployment coordination (Option A: landing page + backend)

### High Risk:
- User confusion during transition
- Broken links if migration not done carefully
- Booking flow issues if forms not tested thoroughly
- Backend serving landing page (Option A) - deployment coupling

### Mitigation:
- Thorough testing before deployment
- Phased rollout
- Monitor analytics closely
- Have rollback plan ready
- Consider Option B if deployment coupling becomes an issue

---

## Success Metrics

### After Implementation:
- [ ] All three sites load correctly
- [ ] Booking flows work on specialized sites
- [ ] No increase in booking errors
- [ ] User engagement maintained or improved
- [ ] SEO rankings maintained
- [ ] Page load times acceptable
- [ ] Mobile experience good on all sites
- [ ] Cross-domain navigation smooth

---

## Next Steps

1. **Review this refined plan** and provide feedback
2. **Choose deployment option** (Option A recommended)
3. **Choose domain names** from suggestions or propose alternatives
4. **Approve implementation approach** (phased vs big bang)
5. **Begin Phase 1** (Preparation) once approved

---

## Questions for Discussion

1. **Deployment Option**: Option A (backend serves landing) or Option B (all separate)?
2. **Domain Names**: Which domains do you prefer?
3. **Deployment**: Separate repositories or monorepo?
4. **Code Sharing**: How should we share i18n and common components?
5. **Timeline**: What's the target completion date?
6. **Testing**: Who will test each frontend before deployment?
7. **Analytics**: How should we track users across domains?
8. **Landing Page Build**: How should we handle building landing page into backend? (Manual copy vs automated)

---

**Document Version**: 2.0 (REFINED)  
**Created**: 2024  
**Last Updated**: 2024  
**Status**: Awaiting Approval

**Key Changes from v1.0**:
- Added "Current Deployment Architecture" section
- Added "Proposed Deployment Architecture" section with two options
- Updated "Backend Modifications Required" with deployment-specific changes
- Updated "Implementation Steps" with deployment details
- Updated "File Structure" to reflect deployment options
- Added "Deployment Workflow" section
- Updated risk assessment with deployment considerations

