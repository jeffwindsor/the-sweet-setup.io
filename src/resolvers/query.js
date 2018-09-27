import { script } from './queries/script'

export default {
    description: () => `The Sweet Setup's Queryable Graph`,
    // ? bring language in from shell
    script: (obj, { os, language, tokens }, context, info) => script(os, language, tokens)
}