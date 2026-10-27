#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/7b1aac3b61fb4f4e2b07cccc142346b7f048399aaa870b69344fbfc56d2b233c/contract';
import startContract from '../../snapshots/7b1aac3b61fb4f4e2b07cccc142346b7f048399aaa870b69344fbfc56d2b233c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/cd73ba16b4afbeb175112d884cb36f093d181c1ccfdcfe80a8a44138451da5fc/contract';
import endContract from '../../snapshots/cd73ba16b4afbeb175112d884cb36f093d181c1ccfdcfe80a8a44138451da5fc/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'organization_members',
        constraint: 'organization_members_status_check_697c26d8',
      }),
      this.dropColumn({ schema: 'public', table: 'organizations', column: 'timeZone' }),
      this.dropColumn({ schema: 'public', table: 'refresh_tokens', column: 'reuse_Dectected_at' }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'sessions',
        constraint: 'sessions_plaform_check_74535dae',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'sessions',
        constraint: 'sessions_revokedReason_check_ed4a7b66',
      }),
      this.dropColumn({ schema: 'public', table: 'sessions', column: 'plaform' }),
      this.dropColumn({ schema: 'public', table: 'sessions', column: 'revokedReason' }),
      this.addColumn({
        schema: 'public',
        table: 'organizations',
        column: col('time_zone', 'text', {
          notNull: true,
          default: lit('UTC'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'refresh_tokens',
        column: col('reuse_detected_at', 'timestamptz(3)', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'sessions',
        column: col('revoked_reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'sessions',
        column: 'platform',
        type: 'text',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'organization_members',
        constraint: 'organization_members_status_check_4cc0f702',
        expression: sql`"status" IN ('active', 'revoked')`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'sessions',
        constraint: 'sessions_platform_check_e32b6888',
        expression: sql`"platform" IN ('web', 'ios', 'android', 'other')`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'sessions',
        constraint: 'sessions_revoked_reason_check_ad04e32b',
        expression: sql`"revoked_reason" IN ('logout', 'logout_all', 'user_request', 'password_changed', 'password_reset', 'token_reuse', 'device_revoked', 'membership_revoked', 'security', 'admin_action')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
