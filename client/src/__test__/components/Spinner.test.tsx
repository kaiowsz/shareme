import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, test, it, expect } from "vitest"
import { Spinner } from "../../components"

describe("Spinner", () => {
    test("should render spinner with message correctly", () => {
        const { debug } = render(<Spinner message="Hello world"/>)

        const myText = screen.getByText(/hello world/i)

        expect(myText).toBeInTheDocument()
    })
})