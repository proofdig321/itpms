# Backend Issues Report - ITPMS WBS Module

**To:** Mzomuhle Nkosi (ICT Manager, Newcastle Municipality)  
**From:** ITPMS Frontend Development Team  
**Date:** June 30, 2026  
**Subject:** Critical Backend Schema Issues Blocking WBS Functionality

## Executive Summary

The WBS (Work Breakdown Structure) module integration has revealed critical backend schema inconsistencies that are blocking core functionality. Two main issues require immediate attention:

1. **WBS Owner Assignment** - Schema inconsistency between validation and database constraints
2. **WBS Sibling Sequence** - Unique constraint conflicts with soft-delete functionality

## Issue #1: WBS Owner Assignment (Critical)

### Problem
The `wbs_nodes.ownerId` field has conflicting schema requirements:
- **Validation Rule**: Requires integer values
- **Foreign Key Constraint**: References `users.id` (UUID strings)
- **Result**: All owner assignments fail

### Technical Details
```sql
-- Current FK constraint expects UUIDs
CONSTRAINT `wbs_nodes_ownerid_foreign` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`)

-- But validation expects integers
"The owner id field must be integer"
```

### Error Examples
```json
// Sending UUID (what FK expects)
{"ownerId": "019efb29-5327-7228-bc6b-06cd9186c5ae"}
→ Error: "The owner id field must be an integer"

// Sending integer (what validation expects)  
{"ownerId": 2}
→ Error: "Integrity constraint violation: Cannot add or update a child row: foreign key constraint fails"
```

### Frontend Impact
- **Responsible Person dropdown is disabled** with message: "Backend schema issue - contact Mr Nkosi"
- All WBS nodes created with `ownerId: null`
- Cannot assign ownership/responsibility

### Solution Options
**Option A (Recommended):** Change validation to accept UUID strings
```php
// In WBS validation rules
'ownerId' => 'nullable|uuid|exists:users,id'
```

**Option B:** Change database schema to use integer user IDs
```sql
-- Would require major migration
ALTER TABLE users ADD COLUMN integer_id INT AUTO_INCREMENT;
ALTER TABLE wbs_nodes MODIFY ownerId INT;
-- Update all existing references
```

---

## Issue #2: WBS Sibling Sequence Constraint (Critical)

### Problem
Unique constraint `uq_wbs_sibling_sequence` prevents creating children under parents that had previous soft-deleted nodes.

### Technical Details
```sql
-- Current constraint (problematic)
UNIQUE KEY `uq_wbs_sibling_sequence` (`projectCode`, `parentId`, `sequence`)

-- This constraint includes soft-deleted records (deleted_at != NULL)
-- When user "deletes" child nodes, they're soft-deleted but still block new sequences
```

### Error Example
```json
{
  "message": "Duplicate entry 'ITP-2026-0007-019f1779-78b9-738a-9745-c11dda215ada-1' for key 'wbs_nodes.uq_wbs_sibling_sequence'",
  "exception": "Illuminate\\Database\\UniqueConstraintViolationException"
}
```

### Affected Projects
- **ITP-2026-0007 (ICT Service Desk Implementation)**: Cannot create child nodes
- Any project where WBS nodes were previously deleted

### Frontend Impact
- Root node creation works ✅
- Child node creation fails on projects with deletion history ❌
- Users see constraint violation errors

### Solution Options
**Option A (Recommended):** Modify constraint to exclude soft-deleted records
```sql
-- Remove existing constraint
ALTER TABLE wbs_nodes DROP INDEX uq_wbs_sibling_sequence;

-- Add new constraint excluding soft-deleted records
-- Note: MySQL syntax may vary, check your version
ALTER TABLE wbs_nodes ADD CONSTRAINT uq_wbs_sibling_sequence_active 
UNIQUE (projectCode, parentId, sequence) WHERE deleted_at IS NULL;
```

**Option B:** Hard delete soft-deleted records before creating new ones
```php
// In WbsNodeService, before creating new node
WbsNode::onlyTrashed()
    ->where('projectCode', $projectCode)
    ->where('parentId', $parentId) 
    ->forceDelete();
```

---

## Current API Status

### Working Endpoints ✅
- `GET /api/v1/projects` - Returns projects with UUID managerId
- `GET /api/v1/users` - Returns users with UUID id
- `GET /api/v1/wbs?projectCode={code}` - Returns WBS nodes
- `POST /api/v1/wbs` - Creates root WBS nodes (with ownerId: null)

### Broken Functionality ❌
- WBS owner assignment (both creation and updates)
- Child WBS node creation on projects with deletion history

## Recommended Priority

1. **High Priority:** Fix Issue #1 (Owner Assignment) - Critical for user workflow
2. **Medium Priority:** Fix Issue #2 (Sequence Constraint) - Affects specific projects

## Testing Data

### Current Users (for owner assignment testing)
```json
[
  {"id": "019eefc5-dfc9-7084-a1a8-714fde2f463a", "name": "Developer"},
  {"id": "019efb29-5327-7228-bc6b-06cd9186c5ae", "name": "Mzomuhle Nkosi"},
  {"id": "019efb49-4a7a-7221-8c6e-dfd385d5e511", "name": "ICT"},
  {"id": "019efb66-e73b-729e-8c28-6704f787c072", "name": "admin"},
  {"id": "019f12d8-aa7f-715a-8298-402c55708b9d", "name": "Zama Nkala"},
  {"id": "019f12de-18eb-7249-ac97-05859bf4e06e", "name": "Wikus Potgieter"},
  {"id": "019f1358-f038-7016-92cf-1e41cf276871", "name": "Sindiswa Mazibuko"}
]
```

### Test Commands for Verification

After fixes, these should succeed:
```bash
# Test owner assignment with UUID
curl -X POST "$API_BASE/wbs" -d '{
  "projectCode": "ITP-2026-0007",
  "name": "Test Node with Owner", 
  "level": "project",
  "ownerId": "019efb29-5327-7228-bc6b-06cd9186c5ae"
}'

# Test child creation after previous deletions  
curl -X POST "$API_BASE/wbs" -d '{
  "projectCode": "ITP-2026-0007",
  "parentId": "019f1779-78b9-738a-9745-c11dda215ada",
  "name": "New Child Node",
  "level": "phase"
}'
```

---

## Frontend Temporary Workarounds

We've implemented these temporary measures:
- Owner dropdown disabled with helpful error message
- WBS creation forced to `ownerId: null` 
- Error messages show actual backend responses
- Graceful fallback to mock data when API unavailable

## Request for Action

Please prioritize fixing Issue #1 (owner assignment) as it significantly impacts user workflow. Once resolved, we can re-enable the responsible person assignment feature.

Let us know if you need any additional technical details or assistance with testing the fixes.

**Contact:** ITPMS Development Team  
**Ngrok URL:** https://6200-2c0f-f4c0-b1b8-fef1-9c82-73c5-53b6-28e2.ngrok-free.app/api/v1  
**Frontend URL:** https://itpms.vercel.app/dashboard/planning