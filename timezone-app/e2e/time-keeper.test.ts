import { test, expect } from '@playwright/test';
import { timeKeeperPage } from './page-objects/timeKeeperPage'
import { formatTime, convertStringTimeToDate, isTimeSorted } from './utils';

test('User can view if website has title: Time Keeper', async ({ page }) => {
  await page.goto('localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Time Keeper/);
});

test('User can view a record marked as You with local timezone by default', async ({ page }) => {
  // When
  const timekeeper = new timeKeeperPage(page);
  await timekeeper.navigate();
  
  //Then
  expect(await timekeeper.getTableRowsCount()).toEqual(1);
  const labelColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Label");
  expect(labelColumnValues).toContain("Local(You)")

  let currentDateTime= new Date().toLocaleString()
  const formattedTime = formatTime(currentDateTime)
  const timeColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Local Time");
  expect(timeColumnValues).toContain(formattedTime)
});

test('User should be able to add a record for any timezone with custom label', async ({ page }) => {
  // Given
  const timekeeper = new timeKeeperPage(page);
  await timekeeper.navigate();
  //When
  await timekeeper.addTimezone("Dummy","Pacific Standard Time")
  //Then
  expect(await timekeeper.getTableRowsCount()).toEqual(2);
  const labelColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Label");
  expect(labelColumnValues).toContain("Dummy")
  const timezoneColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Timezone");
  expect(timezoneColumnValues).toContain("America/Los_Angeles")
});

test('User can delete newly added record', async ({ page }) => {
  // Given
  const timekeeper = new timeKeeperPage(page);
  await timekeeper.navigate();
  await timekeeper.addTimezone("Dummy1","Pacific Standard Time")
  //When
  await timekeeper.deleteTimezoneByLabelName("Dummy1")
  //Then
  expect(await timekeeper.getTableRowsCount()).toEqual(1);
  const labelColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Label");
  expect(labelColumnValues).not.toContain("Dummy1")
});


test('Table should be sorted from earliest time to latest time', async ({ page }) => {
  // Given
  const timekeeper = new timeKeeperPage(page);
  await timekeeper.navigate();
  //When
  await timekeeper.addTimezone("1","Eastern Standard Time")
  await timekeeper.addTimezone("2","Central Standard Time")
  await timekeeper.addTimezone("3","Mountain Standard Time")
  //Then
  const labelColumnValues: string[] = await timekeeper.getTableColumnValuesByHeader("Local Time")
  const timeObjects = convertStringTimeToDate(labelColumnValues);
  const sorted = isTimeSorted(timeObjects);
  expect(sorted).toBeTruthy();
});

test('User cannot delete record with label Local(You)', async ({ page }) => {
  // Given
  const timekeeper = new timeKeeperPage(page);
  await timekeeper.navigate();
  //When
  await timekeeper.deleteTimezoneByLabelName("Local")
  //Then
  expect(await timekeeper.getTableRowsCount()).toEqual(1);
});







