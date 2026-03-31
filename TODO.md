# TODO: Add Edit Functionality to Transactions Table

## Approved Plan: Phase 1 Frontend First (Edit UI + Modal)

**Status: [ ] Not Started**

### Step 1: ✅ Understanding Complete
- [x] Analyzed HistorialTransacciones.jsx, TransactionForm.jsx, api/transaction.js
- [x] Analyzed backend gaps (missing PUT controller/route)

### Step 2: Update TransactionForm.jsx for Edit Mode
- [ ] Add props: `initialData`, `isEdit`, `editingId`, `onCancel`
- [ ] Add `populateFromData()` helper
- [ ] Conditional PUT vs POST in `handleSubmit`
- [ ] Update title, add Cancel button

### Step 3: Update HistorialTransacciones.jsx 
- [ ] Add `editingTx` state
- [ ] Add "Editar" button in table row actions
- [ ] Add modal with TransactionForm when editingTx
- [ ] Import TransactionForm

### Step 4: Backend (Phase 2 - Optional for now)
- [ ] Add `updateTransaction` to backend-radio/controllers/transactionController.js
- [ ] Add PUT route to backend-radio/routes/transactionRoutes.js

### Step 5: Test & Complete
- [ ] Test edit modal opens/populates
- [ ] Test save (expect 404 until backend)
- [ ] attempt_completion

**Next Action:** Edit TransactionForm.jsx (Step 2)

**Instructions:** Reply **"Proceed Step 2"** to continue, or **"Full Backend Now"**, or feedback!

