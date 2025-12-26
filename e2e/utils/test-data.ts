export const TEST_USERS = {
  superadmin: {
    id: "test-superadmin-id",
    name: "Test Superadmin",
    email: "superadmin@test.com",
    password: "TestPassword123!",
    role: "superadmin" as const,
  },
  pic: {
    id: "test-pic-id",
    name: "Test PIC User",
    email: "pic@test.com",
    password: "TestPassword123!",
    role: "pic" as const,
  },
}

export const TEST_STATES = [
  { id: "state-selangor", name: "Selangor" },
  { id: "state-kl", name: "Kuala Lumpur" },
]

export const TEST_CENTERS = [
  {
    id: "center-1",
    slug: "test-center-1",
    dialysisCenterName: "Test Dialysis Center 1",
    sector: "Private",
    town: "Petaling Jaya",
    address: "123 Test Street, PJ",
    addressWithUnit: "Unit 1, 123 Test Street",
    stateId: "state-selangor",
    drInCharge: "Dr. Test",
    drInChargeTel: "012-3456789",
    tel: "03-12345678",
    phoneNumber: "03-12345678",
    title: "Test Center 1",
    units: "10",
  },
  {
    id: "center-2",
    slug: "test-center-2",
    dialysisCenterName: "Test Dialysis Center 2",
    sector: "Government",
    town: "Kuala Lumpur",
    address: "456 KL Street",
    addressWithUnit: "Block A, 456 KL Street",
    stateId: "state-kl",
    drInCharge: "Dr. Test 2",
    drInChargeTel: "012-9876543",
    tel: "03-87654321",
    phoneNumber: "03-87654321",
    title: "Test Center 2",
    units: "15",
  },
  {
    id: "center-3",
    slug: "test-center-3",
    dialysisCenterName: "Test Dialysis Center 3",
    sector: "Private",
    town: "Shah Alam",
    address: "789 Shah Alam Road",
    addressWithUnit: "Suite 5, 789 Shah Alam Road",
    stateId: "state-selangor",
    drInCharge: "Dr. Test 3",
    drInChargeTel: "012-1111111",
    tel: "03-11111111",
    phoneNumber: "03-11111111",
    title: "Test Center 3",
    units: "8",
  },
]

export const PIC_CENTER_ACCESS = [
  { userId: "test-pic-id", centerId: "center-1" },
]
