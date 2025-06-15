import { ZodIssue } from "zod";
//discrimnated union, successful or a set of errors. Now for this to work as a discrimination union one of the two fields must match, which is status.
type ActionResult<G> ={status: 'success', data:G}| {status: 'error', error: string | ZodIssue[] }