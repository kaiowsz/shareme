import "@testing-library/jest-dom"
import { fetchUser } from "../../utils/fetchUser"
import { expect, describe, test } from "vitest"

describe("Fetch User" , () => {
    localStorage.setItem("user", "kaio")
    test("should return user or null", () => {
        const myUser = fetchUser()

        expect(myUser).toBeFalsy()
    })
})