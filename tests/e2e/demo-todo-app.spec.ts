import { test, type Page } from "@playwright/test";
import { TodoPageFactory } from "@factories/todo-page-factory";
import { TodoPage } from "@page-objects/todo-page/todo-page";

let todoPageFactory: TodoPageFactory;

test.beforeEach(async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");
  todoPageFactory = new TodoPageFactory(page);
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
] as const;

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();

    await test.step("Create 1st todo.", async () => {
      await todoPage.createATodoItem(TODO_ITEMS[0]);
    });

    await test.step("Make sure the list only has one todo item.", async () => {
      await todoPage.checkSavedTodoItems([TODO_ITEMS[0]]);
    });

    await test.step("Create 2nd todo.", async () => {
      await todoPage.createATodoItem(TODO_ITEMS[1]);
    });

    await test.step("Make sure the list now has two todo items.", async () => {
      await todoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[1]]);
    });

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test("should clear text input field when an item is added", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createATodoItem(TODO_ITEMS[0]);
    await todoPage.verifyTodoInputEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test("should append new items to the bottom of the list", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await todoPage.verifyTodoCount(3);
    await todoPage.checkSavedTodoItems(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });
});

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should allow me to mark all items as completed", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.markAllAsComplete();
    await todoPage.verifyAllTodosCompleted();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test("should allow me to clear the complete state of all items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.markAllAsComplete();
    await todoPage.unMarkAllAsComplete();
    await todoPage.verifyNoTodosCompleted();
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.markAllAsComplete();
    await todoPage.verifyToggleAllChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    await todoPage.unToggleTodoItem(0);
    await todoPage.verifyToggleAllNotChecked();

    await todoPage.toggleTodoItem(0);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
    await todoPage.verifyToggleAllChecked();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createATodoItem(TODO_ITEMS[0]);
    await todoPage.createATodoItem(TODO_ITEMS[1]);

    await todoPage.toggleTodoItem(0);
    await todoPage.verifyTodoItemCompleted(0);

    await todoPage.verifyTodoItemNotCompleted(1);
    await todoPage.toggleTodoItem(1);

    await todoPage.verifyTodoItemCompleted(0);
    await todoPage.verifyTodoItemCompleted(1);
  });

  test("should allow me to un-mark items as complete", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createATodoItem(TODO_ITEMS[0]);
    await todoPage.createATodoItem(TODO_ITEMS[1]);

    await todoPage.toggleTodoItem(0);
    await todoPage.verifyTodoItemCompleted(0);
    await todoPage.verifyTodoItemNotCompleted(1);
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await todoPage.unToggleTodoItem(0);
    await todoPage.verifyTodoItemNotCompleted(0);
    await todoPage.verifyTodoItemNotCompleted(1);
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  });

  test("should allow me to edit an item", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await todoPage.editTodoItem(1, "buy some sausages");
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);
    await checkTodosInLocalStorage(page, "buy some sausages");
  });
});

test.describe("Editing", () => {
  test.beforeEach(async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should hide other controls when editing", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.verifyEditMode(1);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should save edits on blur", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.editTodoItemAndBlur(1, "buy some sausages");
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);
    await checkTodosInLocalStorage(page, "buy some sausages");
  });

  test("should trim entered text", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.editTodoItem(1, "    buy some sausages    ");
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);
    await checkTodosInLocalStorage(page, "buy some sausages");
  });

  test("should remove the item if an empty text string was entered", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.editTodoItem(1, "");
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should cancel edits on escape", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.cancelEdit(1, "buy some sausages");
    await todoPage.checkSavedTodoItems(TODO_ITEMS);
  });
});

test.describe("Counter", () => {
  test("should display the current number of todo items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createATodoItem(TODO_ITEMS[0]);
    await todoPage.verifyTodoCount(1);

    await todoPage.createATodoItem(TODO_ITEMS[1]);
    await todoPage.verifyTodoCount(2);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe("Clear completed button", () => {
  test.beforeEach(async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should display the correct text", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.toggleTodoItem(0);
    await todoPage.verifyClearCompletedVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.toggleTodoItem(1);
    await todoPage.clearCompleted();
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should be hidden when there are no items that are completed", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.toggleTodoItem(0);
    await todoPage.clearCompleted();
    await todoPage.verifyClearCompletedHidden();
  });
});

test.describe("Persistence", () => {
  test("should persist its data", async ({ page }) => {
    const todoPage = todoPageFactory.getTodoPage();
    
    // Create new todo items
    await todoPage.createDefaultTodos(TODO_ITEMS.slice(0, 2));

    // Create 2nd page with todos
    const secondPage = await page.context().newPage();
    await secondPage.goto('https://demo.playwright.dev/todomvc');
    const secondTodoPage = new TodoPage(secondPage);
    
    await secondTodoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[1]]);
  });
});

test.describe("Routing", () => {
  test.beforeEach(async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await todoPage.toggleTodoItem(1);
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  });

  test("should allow me to display active items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.filterActive();
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should respect the back button", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.filterActive();
    await todoPage.filterCompleted();
    await todoPage.checkSavedTodoItems([TODO_ITEMS[1]]);
    await page.goBack();
    await todoPage.checkSavedTodoItems([TODO_ITEMS[0], TODO_ITEMS[2]]);
    await page.goBack();
    await todoPage.checkSavedTodoItems(TODO_ITEMS);
  });

  test("should allow me to display completed items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.filterCompleted();
    await todoPage.checkSavedTodoItems([TODO_ITEMS[1]]);
  });

  test("should allow me to display all items", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.filterActive();
    await todoPage.filterCompleted();
    await todoPage.filterAll();
    await todoPage.checkSavedTodoItems(TODO_ITEMS);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    let todoPage = todoPageFactory.getTodoPage();
    await todoPage.verifyFilterSelected("All");
    await todoPage.filterActive();
    await todoPage.verifyFilterSelected("Active");
    await todoPage.filterCompleted();
    await todoPage.verifyFilterSelected("Completed");
  });
});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}

async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
  }, expected);
}

async function checkTodosInLocalStorage(page: Page, title: string) {
  return await page.waitForFunction(t => {
    return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
  }, title);
}
