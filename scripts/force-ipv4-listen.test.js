const { spawnSync } = require('child_process');
const path = require('path');

describe('expo listen patch', () => {
  it('accepts both 127.0.0.1 and ::1', () => {
    const script = path.join(process.cwd(), 'scripts/force-ipv4-listen.check.cjs');
    const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
    expect(result.status).toBe(0);
  });
});
