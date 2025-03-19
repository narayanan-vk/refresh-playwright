import { Page } from "@playwright/test";
import { TodoPage } from "@page-objects/todo-page/todo-page";

export class TodoPageFactory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getTodoPage() {
    return new TodoPage(this.page);
  }
}
