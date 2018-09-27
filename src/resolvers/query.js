import { script } from './queries/script'

export default {
    description: () => `The Sweet Setup's Queryable Graph`,
    script: (obj, { fragments }, context, info) => script('sh', fragments)
}