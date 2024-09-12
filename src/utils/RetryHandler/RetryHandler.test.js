import { describe, it, mock } from "node:test"
import assert from 'node:assert/strict'
import RetryHandler from "./RetryHandler.js"
import TooManyAttemptsError from "./TooManyAttemptsError.js"

describe('Retry Handler', () => {
    it('should retry the call if it fails', async () => {
        const fn = mock.fn(async () => {
            await new Promise(resolve => setTimeout(resolve, 30))
            throw new Error("")
        })

        try {
            await new RetryHandler(fn).run()
        } catch (e) {}
        assert.equal(fn.mock.callCount(), 3)
    })

    it('should throw a an error containing the fn name when exceeding tries', async () => {
        function namedFn() {
            throw new Error("")
        }

        assert.rejects(
            () => new RetryHandler(namedFn).run(),
            new TooManyAttemptsError("namedFn exceeded max number of tries (3)")
        )
    })
})