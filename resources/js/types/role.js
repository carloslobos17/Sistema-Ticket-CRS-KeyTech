/**
 * @typedef {'admin' | 'agent' | 'user'} RoleName
 */

/**
 * @typedef {Object} Role
 * @property {number} id
 * @property {RoleName} name
 * @property {string} guard_name
 * @property {string} [created_at] - Opcional
 * @property {string} [updated_at] - Opcional
 * @property {Object} [pivot] - Opcional
 * @property {string} pivot.model_type
 * @property {number} pivot.model_id
 * @property {number} pivot.role_id
 */

