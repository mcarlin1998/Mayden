# Shopping list

A small shopping list app. You can add items, remove them, tick them off when
you have got them, move them around, and set a budget.

## Running it

You need Node 24.

```bash
npm install
npm run dev
```

Then open http://localhost:3000

The database makes itself the first time you load the page. There is nothing to
set up. It fills itself with a few items so there is something to look at.

If you want to start again, delete the `shopping_list.db` file and reload the
page.

```bash
npm test
```

## What is in it

| Story | What it does                                      |
| ----- | ------------------------------------------------- |
| 1     | See the items on the list                         |
| 2     | Add an item                                       |
| 3     | Remove an item                                    |
| 4     | Tick an item off                                  |
| 5     | The list is still there when you come back        |
| 6     | Move items up and down                            |
| 7     | Shows the total cost                              |
| 8     | Set a limit and it tells you when you are over it |

I did stories 1 to 8. I did not do 9 (email) or 10 (login). Without login
everybody sees the same list, so if you use it with someone else they can
change your list.

## How it works

Next.js with TypeScript. The list is stored in a SQLite file.

```
app/
  page.tsx        the page. It reads the list and draws it
  actions.ts      the things you can do to the list
  components/     the form, one row of the list, the budget form
  money.ts        working out prices
  types.ts        what an item looks like
lib/db.ts         the database
tests/            the tests
```

The page runs on the server so it can read the database straight away. When you
click something it sends the change to the server, the server saves it, and the
page refreshes itself.

There is no API. I did not think it was needed for one page.

## Tests

17 tests. They cover the money, the database, the order of the list, and the
budget.

## Things I know are not right

- No login. Anyone using the app has the same list and the same budget.
- If I change the shape of the database I have to delete the file and let it
  make itself again. There is no way to migrate it.
- Clicking the checkbox, the up arrow and the Set button are not tested.
