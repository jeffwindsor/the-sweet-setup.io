import { script } from './queries/script'

export default {
    description: () => `The Sweet Setup's Queryable Graph`,
    header: () => "#!/bin/sh",
    script: (obj, { fragments }, context, info) => script(fragments)
}