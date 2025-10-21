# User Management Module

This module provides comprehensive user management functionality including CRUD operations and specialized endpoints for borrow history, club administration, and user clubs.

## API Endpoints

### Core User CRUD Operations

- `GET /users` - List all users (with pagination and filters)
- `GET /users/:id` - Get a specific user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### User Management Endpoints

- `GET /users/history` - Get user's borrow history
- `GET /users/admin/club/:club_id` - Get club administrators
- `GET /users/moderator/club/:club_id` - Get club moderators
- `GET /users/clubs` - Get user's clubs

## Hooks

### Core CRUD Hooks

#### `useUserList(filters?)`

Fetch a paginated list of users with optional filters.

```tsx
import { useUserList } from "@/entities/user";

function UserListPage() {
  const { data, isLoading, error } = useUserList({
    page: 1,
    limit: 10,
    search: "john",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <p>Total: {data?.total}</p>
    </div>
  );
}
```

#### `useUser(id)`

Fetch a single user by ID.

```tsx
import { useUser } from "@/entities/user";

function UserProfile({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

#### `useUserCreate()`

Create a new user.

```tsx
import { useUserCreate } from "@/entities/user";

function CreateUserForm() {
  const { mutate: createUser, isPending } = useUserCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      { name: "John Doe", email: "john@example.com" },
      {
        onSuccess: (user) => {
          console.log("User created:", user);
        },
        onError: (error) => {
          console.error("Failed to create user:", error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

#### `useUserUpdate()`

Update an existing user.

```tsx
import { useUserUpdate } from "@/entities/user";

function EditUserForm({ userId }: { userId: number }) {
  const { mutate: updateUser, isPending } = useUserUpdate();

  const handleUpdate = () => {
    updateUser(
      {
        id: userId,
        body: { name: "Jane Doe", email: "jane@example.com" },
      },
      {
        onSuccess: () => {
          console.log("User updated successfully");
        },
      }
    );
  };

  return (
    <button onClick={handleUpdate} disabled={isPending}>
      Update User
    </button>
  );
}
```

#### `useUserDelete()`

Delete a user.

```tsx
import { useUserDelete } from "@/entities/user";

function DeleteUserButton({ userId }: { userId: number }) {
  const { mutate: deleteUser, isPending } = useUserDelete();

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      deleteUser({ id: userId });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete User"}
    </button>
  );
}
```

### User Management Hooks

#### `useBorrowHistory()`

Fetch the current user's borrow history.

```tsx
import { useBorrowHistory } from "@/entities/user";

function BorrowHistoryPage() {
  const { data, isLoading, error } = useBorrowHistory();

  if (isLoading) return <div>Loading history...</div>;
  if (error) return <div>Error loading history</div>;

  return (
    <div>
      <h2>Borrow History</h2>
      {data?.history.map((item) => (
        <div key={item.id}>
          <h3>{item.itemName}</h3>
          <p>Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}</p>
          <p>Status: {item.status}</p>
          {item.returnedAt && (
            <p>Returned: {new Date(item.returnedAt).toLocaleDateString()}</p>
          )}
        </div>
      ))}
      <p>Total items: {data?.total}</p>
    </div>
  );
}
```

#### `useClubAdmins(clubId)`

Fetch administrators for a specific club.

```tsx
import { useClubAdmins } from "@/entities/user";

function ClubAdminsPage({ clubId }: { clubId: number }) {
  const { data, isLoading, error } = useClubAdmins(clubId);

  if (isLoading) return <div>Loading admins...</div>;
  if (error) return <div>Error loading admins</div>;

  return (
    <div>
      <h2>Club Administrators</h2>
      {data?.admins.map((admin) => (
        <div key={admin.id}>
          <p>
            {admin.name} - {admin.email}
          </p>
          {admin.assignedAt && (
            <small>
              Admin since: {new Date(admin.assignedAt).toLocaleDateString()}
            </small>
          )}
        </div>
      ))}
      <p>Total admins: {data?.total}</p>
    </div>
  );
}
```

#### `useClubModerators(clubId)`

Fetch moderators for a specific club.

```tsx
import { useClubModerators } from "@/entities/user";

function ClubModeratorsPage({ clubId }: { clubId: number }) {
  const { data, isLoading, error } = useClubModerators(clubId);

  if (isLoading) return <div>Loading moderators...</div>;
  if (error) return <div>Error loading moderators</div>;

  return (
    <div>
      <h2>Club Moderators</h2>
      {data?.moderators.map((moderator) => (
        <div key={moderator.id}>
          <p>
            {moderator.name} - {moderator.email}
          </p>
          {moderator.assignedAt && (
            <small>
              Moderator since:{" "}
              {new Date(moderator.assignedAt).toLocaleDateString()}
            </small>
          )}
        </div>
      ))}
      <p>Total moderators: {data?.total}</p>
    </div>
  );
}
```

#### `useUserClubs()`

Fetch all clubs that the current user belongs to.

```tsx
import { useUserClubs } from "@/entities/user";

function MyClubsPage() {
  const { data, isLoading, error } = useUserClubs();

  if (isLoading) return <div>Loading clubs...</div>;
  if (error) return <div>Error loading clubs</div>;

  return (
    <div>
      <h2>My Clubs</h2>
      {data?.clubs.map((club) => (
        <div key={club.id}>
          <h3>{club.name}</h3>
          {club.description && <p>{club.description}</p>}
          <p>
            Role: <strong>{club.role}</strong>
          </p>
          <small>Joined: {new Date(club.joinedAt).toLocaleDateString()}</small>
        </div>
      ))}
      <p>Total clubs: {data?.total}</p>
    </div>
  );
}
```

## Types

### Core Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateUserDto {
  name: string;
  email: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
```

### User Management Types

```typescript
interface BorrowHistoryItem {
  id: number;
  userId: number;
  itemId: number;
  itemName: string;
  borrowedAt: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
}

interface BorrowHistoryResponse {
  history: BorrowHistoryItem[];
  total: number;
  page?: number;
  limit?: number;
}

interface Club {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

interface ClubAdmin extends User {
  clubId: number;
  assignedAt?: string;
}

interface ClubAdminsResponse {
  admins: ClubAdmin[];
  clubId: number;
  total: number;
}

interface ClubModerator extends User {
  clubId: number;
  assignedAt?: string;
}

interface ClubModeratorsResponse {
  moderators: ClubModerator[];
  clubId: number;
  total: number;
}

interface UserClub extends Club {
  role: "admin" | "moderator" | "member";
  joinedAt: string;
}

interface UserClubsResponse {
  clubs: UserClub[];
  total: number;
}
```

## Direct Query Usage

If you need more control, you can use the query configurations directly:

```tsx
import { useQuery } from "@tanstack/react-query";
import { userManagementQueries } from "@/entities/user";

function CustomComponent() {
  const { data } = useQuery({
    ...userManagementQueries.borrowHistory(),
    // Add custom options
    refetchInterval: 5000,
    staleTime: 30000,
  });

  // ...
}
```

## Architecture

The User Management module follows the Feature-Sliced Design (FSD) architecture:

```
entities/user/
├── api/                      # API layer
│   ├── index.ts             # Public exports
│   ├── user.query.ts        # Query configurations
│   ├── useUser.ts           # CRUD hooks
│   ├── useUserList.ts
│   ├── useUserCreate.ts
│   ├── useUserUpdate.ts
│   ├── useUserDelete.ts
│   ├── useBorrowHistory.ts  # User Management hooks
│   ├── useClubAdmins.ts
│   ├── useClubModerators.ts
│   └── useUserClubs.ts
└── model/                    # Domain layer
    ├── index.ts             # Public exports
    └── User.ts              # Type definitions
```

## Notes

- All mutations automatically invalidate related queries for cache consistency
- Queries use `keepPreviousData` for smooth pagination
- Authentication tokens are automatically included in requests via axios interceptors
- All endpoints follow REST conventions
- TypeScript provides full type safety for all operations
