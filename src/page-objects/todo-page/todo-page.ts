import { expect, Locator, Page } from "@playwright/test";

export class TodoPage {
  private page: Page;
  private todoEntryField: Locator;
  private todoItemSaved: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoEntryField = this.page.getByPlaceholder("What needs to be done?");
    this.todoItemSaved = this.page.getByTestId("todo-title");
  }

  async createATodoItem(todoItemName: string) {
    await this.todoEntryField.fill(todoItemName);
    await this.todoEntryField.press("Enter");
  }

  async checkSavedTodoItems(todoItemName: string[]) {
    await expect(this.todoItemSaved).toHaveText(todoItemName);
  }
}
