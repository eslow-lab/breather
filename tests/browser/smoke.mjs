import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const chromeCandidates = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];
const executablePath = chromeCandidates.find((path) => existsSync(path));
if (!executablePath) throw new Error('GitHub runner has no Chromium/Chrome executable.');

const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4173', '--strictPort',
], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, DISABLE_HMR: 'true' },
});

let serverOutput = '';
for (const stream of [server.stdout, server.stderr]) {
  stream.on('data', (data) => { serverOutput += data.toString(); });
}

async function waitUntilReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error('Vite exited: ' + serverOutput);
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite did not become ready: ' + serverOutput);
}

function watchPageErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return () => assert.deepEqual(errors, [], 'Browser JavaScript errors');
}

async function desktopCatalog(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const assertNoErrors = watchPageErrors(page);
  try {
    await page.goto(origin);
    await page.getByRole('heading', { name: '¿Qué necesitas ahora?' }).waitFor();
    await page.getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('button', { name: 'Explorar' }).click();
    await page.getByRole('heading', { name: 'Catálogo de Técnicas' }).waitFor();

    const boxCard = page.getByRole('button', { name: /Respiración en Caja/ }).last();
    await boxCard.focus();
    await page.keyboard.press('Enter');

    const modal = page.getByRole('dialog', { name: 'Respiración en Caja' });
    await modal.waitFor({ state: 'visible' });
    assert.equal(await modal.getAttribute('aria-modal'), 'true');
    assert.equal(await modal.getAttribute('aria-describedby'), 'technique-detail-description');
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest('dialog')), true);

    assert.match(await modal.locator('ol li').first().innerText(), /3 s/);
    assert.equal(
      await modal.getByRole('group', { name: 'Selecciona el protocolo' }).getByRole('button', { name: /Caja Corta/ }).getAttribute('aria-pressed'),
      'true',
    );
    await modal.getByRole('group', { name: 'Selecciona el protocolo' }).getByRole('button', { name: /Caja Clásica/ }).click();
    assert.match(await modal.locator('ol li').first().innerText(), /4 s/);
    assert.equal(
      await modal.getByRole('group', { name: 'Selecciona el protocolo' }).getByRole('button', { name: /Caja Clásica/ }).getAttribute('aria-pressed'),
      'true',
    );
    assert.match(await modal.innerText(), /Si sientes mareo/);

    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => {
      const focused = document.activeElement;
      return focused instanceof HTMLButtonElement && focused.textContent?.includes('Respiración en Caja');
    });
    assert.equal(await boxCard.evaluate((button) => document.activeElement === button), true,
      'Focus should return to the card after Escape');

    await boxCard.click();
    await modal.waitFor({ state: 'visible' });
    await modal.getByRole('group', { name: 'Selecciona el protocolo' }).getByRole('button', { name: /Caja Clásica/ }).click();
    await modal.getByRole('button', { name: /Iniciar Sesión/ }).click();
    await page.getByRole('button', { name: 'Salir de la sesión' }).waitFor();
    assert.match(await page.locator('body').innerText(), /Caja Clásica/);
    await page.getByRole('button', { name: 'Salir de la sesión' }).click();
    await page.getByRole('navigation', { name: 'Navegación principal' }).waitFor();
    assertNoErrors();
    console.log('PASS desktop catalog, keyboard, native modal, protocol switch, session start/stop');
  } finally {
    await page.close();
  }
}

async function mobileCatalog(browser) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 780 },
    isMobile: true,
    hasTouch: true,
  });
  const assertNoErrors = watchPageErrors(page);
  try {
    await page.goto(origin);
    await page.getByRole('heading', { name: '¿Qué necesitas ahora?' }).waitFor();
    await page.getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('button', { name: 'Explorar' }).click();

    await page.getByRole('button', { name: 'Expansión Costal' }).click();
    await page.getByRole('button', { name: /Respiración Costal Lateral/ }).waitFor();
    await page.getByRole('button', { name: 'Todas' }).click();

    const boxCard = page.getByRole('button', { name: /Respiración en Caja/ }).last();
    await boxCard.click();
    const modal = page.getByRole('dialog', { name: 'Respiración en Caja' });
    await modal.waitFor({ state: 'visible' });
    const bounds = await modal.boundingBox();
    assert.ok(bounds && bounds.x >= -1 && bounds.y >= -1
      && bounds.x + bounds.width <= 391 && bounds.y + bounds.height <= 781,
      'Mobile dialog must fit viewport');
    await modal.getByRole('group', { name: 'Selecciona el protocolo' }).getByRole('button', { name: /Caja Clásica/ }).click();
    assert.match(await modal.locator('ol li').first().innerText(), /4 s/);
    await modal.getByRole('button', { name: 'Cerrar detalles' }).click();
    await modal.waitFor({ state: 'hidden' });
    assertNoErrors();
    console.log('PASS mobile viewport, expansion category, scrollable dialog and protocol details');
  } finally {
    await page.close();
  }
}

async function safetyDialog(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  const assertNoErrors = watchPageErrors(page);
  try {
    await page.goto(origin + '/tests/browser/safety-fixture.html');
    const opener = page.getByRole('button', { name: 'Abrir aviso de seguridad' });
    await opener.waitFor();
    await opener.focus();
    await opener.click();

    const modal = page.getByRole('dialog', { name: 'Aviso de práctica segura' });
    await modal.waitFor({ state: 'visible' });
    assert.equal(await modal.getAttribute('aria-modal'), 'true');
    assert.equal(await modal.getAttribute('aria-describedby'), 'safety-description safety-level');
    assert.match(await modal.innerText(), /Aviso específico del protocolo/);
    assert.match(await modal.innerText(), /Contraindicación: Restricción específica del protocolo/);
    assert.doesNotMatch(await modal.innerText(), /Aviso general de prueba/);
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest('dialog')), true);

    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest('dialog')), true,
      'Focus should remain inside a modal during keyboard navigation');
    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });
    assert.match(await page.getByRole('status').innerText(), /cancelado/);
    assert.equal(await opener.evaluate((button) => document.activeElement === button), true,
      'Safety Escape should restore focus');

    await opener.click();
    await modal.waitFor({ state: 'visible' });
    await modal.getByRole('button', { name: /Entendido, iniciar/ }).click();
    await modal.waitFor({ state: 'hidden' });
    assert.match(await page.getByRole('status').innerText(), /confirmado/);
    assertNoErrors();
    console.log('PASS native safety dialog warnings, focus, Escape/cancel, confirmation');
  } finally {
    await page.close();
  }
}

let browser;
try {
  await waitUntilReady();
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  await desktopCatalog(browser);
  await mobileCatalog(browser);
  await safetyDialog(browser);
  console.log('Browser smoke validation: ALL PASSED');
} catch (error) {
  console.error('Browser smoke validation failed:', error);
  console.error(serverOutput.slice(-4000));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
