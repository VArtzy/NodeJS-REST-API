import { prisma } from "../src/application/database"
import bcrypt from "bcrypt"

const removeTestUser = async () => {
    await prisma.user.deleteMany({
        where: {
            username: "VArtz",
        },
    })
}

const createTestUser = async () => {
    await prisma.user.create({
        data: {
            username: "VArtz",
            password: await bcrypt.hash("rahasia", 10),
            name: "Farrel Nikoson",
            token: "test",
        },
    })
}

const getTestUser = async () => {
    return await prisma.user.findUnique({
        where: {
            username: "VArtz",
        },
    })
}

const removeAllTestContacts = async () => {
    await prisma.contact.deleteMany({
        where: {
            username: "VArtz",
        },
    })
}

const createTestContact = async () => {
    await prisma.contact.create({
        data: {
            username: "VArtz",
            first_name: "Farrel",
            last_name: "Nikoson",
            email: "farrelnikoson@gmail.com",
            phone: "081234567890",
        },
    })
}

const getTestContact = async () => {
    return await prisma.contact.findFirst({
        where: {
            username: "VArtz",
        },
    })
}

const createManyTestContacts = async () => {
    for (let i = 0; i < 15; i++) {
        await prisma.contact.create({
            data: {
                username: `VArtz`,
                first_name: `Farrel ${i}`,
                last_name: `Nikoson ${i}`,
                email: `farrel${i}@gmail.com`,
                phone: `08123456789${i}`,
            },
        })
    }
}

const removeAllTestAddresses = async () => {
    await prisma.address.deleteMany({
        where: {
            contact: {
                username: "VArtz",
            },
        },
    })
}

const createTestAddress = async () => {
    const contact = await getTestContact()
    await prisma.address.create({
        data: {
            contact_id: contact.id,
            street: "jalan test",
            city: "kota test",
            province: "provinsi test",
            country: "indonesia",
            postal_code: "234234",
        },
    })
}

const getTestAddress = async () => {
    return await prisma.address.findFirst({
        where: {
            contact: {
                username: "VArtz",
            },
        },
    })
}

export {
    removeTestUser,
    createTestUser,
    getTestUser,
    removeAllTestContacts,
    createTestContact,
    getTestContact,
    createManyTestContacts,
    removeAllTestAddresses,
    createTestAddress,
    getTestAddress,
}
