import fragmentResolver from './queries/fragment'

export default {
    description: () => `The Sweet Setup's Queryable Graph`,
    header: () => "#!/bin/sh",
    script: (obj, { fragments }, context, info) => fragments.map(o => fragmentResolver(o))
}