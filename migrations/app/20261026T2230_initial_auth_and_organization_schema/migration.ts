#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7b1aac3b61fb4f4e2b07cccc142346b7f048399aaa870b69344fbfc56d2b233c/contract';
import endContract from '../../snapshots/7b1aac3b61fb4f4e2b07cccc142346b7f048399aaa870b69344fbfc56d2b233c/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'organization_members',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('organization_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'organization_members_role_check_64595392',
            sql`"role" IN ('owner', 'admin', 'sub_admin')`,
          ),
          checkExpression(
            'organization_members_status_check_697c26d8',
            sql`"status" IN ('active', 'suspended')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'organizations',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('created_by_user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('timeZone', 'text', {
            notNull: true,
            default: lit('UTC'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'organizations_status_check_697c26d8',
            sql`"status" IN ('active', 'suspended')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'password_refresh_token',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expired_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('token_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('used_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'refresh_tokens',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expired_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('generation', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('replaced_by_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('reuse_Dectected_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('session_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('token_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('used_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'sessions',
        columns: [
          col('app_version', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('current_generation', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('device_name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('expired_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('installation_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('ip_address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('last_used_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('plaform', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('revokedReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('revoked_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_agent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'sessions_plaform_check_74535dae',
            sql`"plaform" IN ('web', 'ios', 'android', 'other')`,
          ),
          checkExpression(
            'sessions_revokedReason_check_ed4a7b66',
            sql`"revokedReason" IN ('logout', 'logout_all', 'user_request', 'password_changed', 'password_reset', 'token_reuse', 'device_revoked', 'membership_revoked', 'security', 'admin_action')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('authVersion', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email_verified_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('first_name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('last_login_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('last_name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password_changed_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
          }),
          col('password_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('users_status_check_39370351', sql`"status" IN ('active', 'disabled')`),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'organization_members',
        constraint: 'organization_members_organization_id_user_id_key',
        columns: ['organization_id', 'user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'organization_members',
        constraint: 'organization_members_organization_id_id_key',
        columns: ['organization_id', 'id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'refresh_tokens',
        constraint: 'refresh_tokens_replaced_by_id_key',
        columns: ['replaced_by_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'refresh_tokens',
        constraint: 'refresh_tokens_session_id_generation_key',
        columns: ['session_id', 'generation'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organization_members',
        index: 'organization_members_organization_id_idx_1a5cd3f5',
        columns: ['organization_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organization_members',
        index: 'organization_members_organization_id_status_role_idx_147bc2c4',
        columns: ['organization_id', 'status', 'role'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organization_members',
        index: 'organization_members_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organization_members',
        index: 'organization_members_user_id_status_idx_ad5e5afd',
        columns: ['user_id', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organizations',
        index: 'organizations_created_by_user_id_idx_764eade2',
        columns: ['created_by_user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'organizations',
        index: 'organizations_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'password_refresh_token',
        index: 'password_refresh_token_user_id_expired_at_idx_c7690802',
        columns: ['user_id', 'expired_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'password_refresh_token',
        index: 'password_refresh_token_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'refresh_tokens',
        index: 'refresh_tokens_session_id_expired_at_idx_0cf0591e',
        columns: ['session_id', 'expired_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'refresh_tokens',
        index: 'refresh_tokens_session_id_idx_00ba47bf',
        columns: ['session_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sessions',
        index: 'sessions_installation_id_idx_7737cc69',
        columns: ['installation_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sessions',
        index: 'sessions_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'sessions',
        index: 'sessions_user_id_revoked_at_expired_at_idx_c2af94d5',
        columns: ['user_id', 'revoked_at', 'expired_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'users',
        index: 'users_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'organization_members',
        foreignKey: {
          name: 'organization_members_organization_id_fkey',
          columns: ['organization_id'],
          references: { schema: 'public', table: 'organizations', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'organization_members',
        foreignKey: {
          name: 'organization_members_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'organizations',
        foreignKey: {
          name: 'organizations_created_by_user_id_fkey',
          columns: ['created_by_user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'password_refresh_token',
        foreignKey: {
          name: 'password_refresh_token_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'refresh_tokens',
        foreignKey: {
          name: 'refresh_tokens_session_id_fkey',
          columns: ['session_id'],
          references: { schema: 'public', table: 'sessions', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'refresh_tokens',
        foreignKey: {
          name: 'refresh_tokens_replaced_by_id_fkey',
          columns: ['replaced_by_id'],
          references: { schema: 'public', table: 'refresh_tokens', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'sessions',
        foreignKey: {
          name: 'sessions_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
