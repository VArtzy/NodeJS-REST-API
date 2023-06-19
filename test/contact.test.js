import {
    createTestUser,
    removeTestUser,
    removeAllTestContacts,
    getTestContact,
    createTestContact,
    createManyTestContacts,
} from "./test-utils.js"
import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"

describe("POST /api/contacts", function () {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeAllTestContacts()
        await removeTestUser()
    })

    it("should can create new contact", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                first_name: "Farrel",
                last_name: "Nikoson",
                email: "farrelnikoson@gmail.com",
                phone: "081234567890",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.first_name).toBe("Farrel")
        expect(result.body.data.last_name).toBe("Nikoson")
        expect(result.body.data.email).toBe("farrelnikoson@gmail.com")
        expect(result.body.data.phone).toBe("081234567890")
    })

    it("should reject if request is invalid", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "Nikoson",
                email: "farrelnikoson",
                phone: "28053890810258350284709798057932490",
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContacts()
        await removeTestUser()
    })

    it("should can get contact", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id)
            .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id)

        expect(result.body.data.first_name).toBe(testContact.first_name)
        expect(result.body.data.last_name).toBe(testContact.last_name)
        expect(result.body.data.email).toBe(testContact.email)
        expect(result.body.data.phone).toBe(testContact.phone)
    })

    it("should return 404 if contact not found", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .get("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
})

describe("PUT /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContacts()
        await removeTestUser()
    })

    it("should can update contact", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id)
            .set("Authorization", "test")
            .send({
                first_name: "Varrel",
                last_name: "Nikodon",
                email: "varrelnikodon@gmail.com",
                phone: "081234567891",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe("Varrel")
        expect(result.body.data.last_name).toBe("Nikodon")
        expect(result.body.data.email).toBe("varrelnikodon@gmail.com")
        expect(result.body.data.phone).toBe("081234567891")
    })

    it("should reject if request is invalid", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id)
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "varrelnikodon",
                phone: "",
            })

        expect(result.status).toBe(400)
    })

    it("should return 404 if contact not found", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .put("/api/contacts" + (testContact.id + 1))
            .set("Authorization", "test")
            .send({
                first_name: "Varrel",
                last_name: "Nikodon",
                email: "varrelnikodon",
                phone: "081234567891",
            })

        expect(result.status).toBe(404)
    })
})

describe("DELETE /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContacts()
        await removeTestUser()
    })

    it("should can delete contact", async () => {
        let testContact = await getTestContact()

        const result = await supertest(web)
            .delete("/api/contacts/" + testContact.id)
            .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        testContact = await getTestContact()
        expect(testContact).toBeNull()
    })

    it("should return 404 if contact not found", async () => {
        let testContact = await getTestContact()

        const result = await supertest(web)
            .delete("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
})

describe("GET /api/contacts", function () {
    beforeEach(async () => {
        await createTestUser()
        await createManyTestContacts()
    })

    afterEach(async () => {
        await removeAllTestContacts()
        await removeTestUser()
    })

    it("should can search without parameter", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("should can search to page 2", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({ page: 2 })
            .set("Authorization", "test")

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("should can search with name", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({ name: "Farrel 1" })
            .set("Authorization", "test")

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it("should can search with email", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({ email: "farrel1" })
            .set("Authorization", "test")

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it("should can search with phone", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({ phone: "081234567891" })
            .set("Authorization", "test")

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })
})
