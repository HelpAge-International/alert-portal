/*
* Custom error type which if thrown will display the thrown error message instead of the generic one
*/
export class DisplayError extends Error {
    constructor(message: string) {
        super(message);
    }
}