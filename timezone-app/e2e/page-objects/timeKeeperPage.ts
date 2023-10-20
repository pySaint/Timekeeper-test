import { Locator, Page } from "@playwright/test";


export class timeKeeperPage {
    private page: Page; 
    private timekeeperTable: Locator;
    private labelInput: Locator;
    private addTimezoneButton: Locator;
    private timezoneSelect: string;
    private saveButton: Locator;
    private deleteTimezoneButton: Locator;

    constructor(page: any) {
        this.page = page;
        this.timekeeperTable = this.page.locator('//table[@class="min-w-full divide-y divide-gray-300"]');
        this.labelInput = this.page.locator('#label')
        this.addTimezoneButton = this.page.locator('//button[text()="Add timezone"]')
        this.timezoneSelect = '//select[@id="timezone"]'
        this.saveButton = this.page.locator('text=Save')
        this.deleteTimezoneButton = this.page.locator('//button[text()="Delete"]')
    }

    async navigate(): Promise<void> {
        await this.page.goto('localhost:3000');
        await this.deleteTimezoneButton.isEnabled()
          }

    async getTableRowsCount(): Promise<number> {
        return await this.timekeeperTable.locator('//tbody/tr').count();
    }

    async getTableColumnIndexByText(columnName: string): Promise<number> {
        return await this.page.locator(`//table/thead/tr/th[text()="${columnName}"]//preceding::th`).count();
    }

    async getTableColumnValuesByHeader(columnHeaderName: string): Promise<string[]> {
        const columnIndex = await this.getTableColumnIndexByText(columnHeaderName) + 1;
        return await this.page.locator("//table/tbody/tr/td["+columnIndex+"]").allInnerTexts();
    }

    async addTimezone(labelName: string, timeZone: string) {
        await this.addTimezoneButton.click()
        await this.labelInput.fill(labelName);
        await this.page.selectOption(this.timezoneSelect, { label: timeZone });
        await this.saveButton.click()
    }

    async deleteTimezoneByLabelName(labelName:string) {
        await this.page.locator(`//td/div[text()="${labelName}"]/..//following-sibling::td/button[text()='Delete']`).click()
    }

}
