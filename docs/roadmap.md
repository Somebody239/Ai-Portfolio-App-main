# Implementation Roadmap

## Phase 1: Core Backend Infrastructure ✅
- [x] Database schema setup (all 10 tables)
- [x] Foreign key relationships and constraints
- [x] Indexes for performance
- [x] Row Level Security (RLS) policies

## Phase 2: Backend API Development

### 2.1 User Portfolio Management
- [ ] API endpoints for user profile CRUD
- [ ] Courses API (CRUD)
  - Calculate GPA endpoint (aggregate from courses)
  - Filter by year/semester
- [ ] Standardized scores API (CRUD)
- [ ] Extracurriculars API (CRUD)
- [ ] Achievements API (CRUD)
- [ ] Personality inputs API (CRUD, optional)

### 2.2 University Management
- [ ] Seed universities table with initial data
- [ ] University search/browse API
  - Filter by country, major, acceptance rate
  - Search by name
- [ ] User targets API (CRUD)
  - Add/remove target universities
  - List user's targets with university details

### 2.3 Comparison & Analytics
- [ ] Comparison endpoint
  - Calculate user GPA from courses
  - Aggregate user test scores (SAT/ACT)
  - Compare user stats vs university requirements
  - Generate strength score (0-100)
- [ ] Competitiveness assessment
  - Strong/Medium/Weak fit classification
  - Gap analysis (what's missing)

### 2.4 AI Insights Engine
- [ ] AI recommendation service integration
  - Input: user portfolio + target universities
  - Output: Suggestions stored in recommendations_ai
- [ ] Improvement suggestions endpoint
  - GPA improvement areas
  - Extracurricular depth recommendations
  - Missing awards/achievements
- [ ] Niche activity suggestions
  - Based on intended_major
  - Research opportunities
  - Competitions/programs
- [ ] University fit analysis
  - Explain standing for each target (strong/medium/weak)
  - Recommend growth areas

### 2.5 Opportunities Browser
- [ ] Seed opportunities table
- [ ] Opportunities API
  - Browse all opportunities
  - Filter by eligibility criteria
  - Search functionality

## Phase 3: Helper Functions & Utilities

### 3.1 Database Functions
- [ ] PostgreSQL function for GPA calculation
  - Weighted/unweighted options
  - Filter by date range
- [ ] Aggregate user stats function
  - Returns complete user profile summary
- [ ] Comparison calculation function
  - Input: user_id, university_id
  - Output: JSON with comparison metrics

### 3.2 Data Validation
- [ ] Input validation middleware
- [ ] Grade conversion utilities (letter to numeric)
- [ ] Test score normalization

## Phase 4: Storage & Media

### 4.1 Supabase Storage Setup
- [ ] Create storage bucket for university images
- [ ] Create storage bucket for opportunity images
- [ ] Create storage bucket for user uploads (optional)
- [ ] Storage policies (public read for universities/opportunities)

## Phase 5: Testing & Optimization

### 5.1 Testing
- [ ] Unit tests for API endpoints
- [ ] Integration tests for complex queries
- [ ] RLS policy testing
- [ ] Performance testing (indexes)

### 5.2 Optimization
- [ ] Query optimization review
- [ ] Add missing indexes if needed
- [ ] Caching strategy for universities/opportunities
- [ ] AI recommendation caching logic

## Phase 6: Frontend Integration (Future)

### 6.1 API Client
- [ ] Generate TypeScript types from database
- [ ] API client setup
- [ ] Error handling utilities

### 6.2 Feature Implementation
- [ ] Portfolio management UI
- [ ] University browser UI
- [ ] Comparison dashboard
- [ ] AI insights display
- [ ] Opportunities browser UI

## Priority Order

**Immediate (Week 1-2):**
1. Phase 2.1 - Portfolio Management APIs
2. Phase 2.2 - University Management APIs
3. Phase 3.1 - GPA calculation function

**Short-term (Week 3-4):**
4. Phase 2.3 - Comparison & Analytics
5. Phase 2.5 - Opportunities Browser
6. Phase 4.1 - Storage setup

**Medium-term (Week 5-6):**
7. Phase 2.4 - AI Insights Engine
8. Phase 5.1 - Testing
9. Phase 3.2 - Validation utilities

**Long-term:**
10. Phase 5.2 - Optimization
11. Phase 6 - Frontend Integration

## Notes

- All backend work should be API-first (REST or GraphQL)
- Use Supabase Edge Functions for AI processing if needed
- Consider rate limiting for AI endpoints
- Cache university/opportunity data aggressively (rarely changes)
- User data changes frequently, cache less aggressively

