
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {string|null} email_verified_at
 */

/**
 * @typedef {Object} Auth
 * @property {User} user
 */

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} title
 * @property {string} href
 */

/**
 * @typedef {Object} NavItem
 * @property {string} title
 * @property {string} url
 * @property {any} [icon]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} SharedData
 * @property {string} name
 * @property {Object} quote
 * @property {Auth} auth
 */

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} title
 * @property {string} href
 */

/**
 * @typedef {Object} NavGroup
 * @property {string} title
 * @property {NavItem[]} items
 */

/** 

/**
 * @typedef {Object} SharedData
 * @property {string} name
 * @property {Object} quote
 * @property {string} quote.message
 * @property {string} quote.author
 * @property {Auth} auth
 */

// Re-exportamos todo lo que venga de los otros archivos JS
export * from './user';
export * from './department';
export * from './role';


