import { test as base, APIRequestContext, expect } from '@playwright/test';

// Types definition
export interface AuthenticatedUser {
    request: APIRequestContext;
    username: string;
    password: string;
};

type ApiFixtures = {
    newUser: AuthenticatedUser;
};

export const test = base.extend<{}, ApiFixtures>({

    newUser: [async ({ playwright }, use) => {

        // Setup Admin context
        const adminContext = await playwright.request.newContext();

        // Login the Admin to be able to create a new User
        const formData = {
            username: `${process.env.ADMIN_USERNAME}`,
            password: `${process.env.ADMIN_PASSWORD}`,
        }

        await adminContext.post('/login', { multipart: formData });

        // Generate user data
        const timestamp = Date.now();
        const newUsername = `user${timestamp}`;
        const defaultPassword = `Passw0rd!`;

        // Create the new user via the Admin's session
        const createUserResponse = await adminContext.post('/api/users/add',
            {
                data:
                {
                    firstName: "Test",
                    lastName: "User",
                    username: newUsername,
                    password: defaultPassword,
                    email: "mail@email.com",
                    about: "Random text",
                    secretQuestion: "Question?",
                    secretAnswer: "Answer",
                    heroCount: 0,
                    heroes: [],
                }
            });

        // Verify that the user create request hasn't failed
        expect(createUserResponse.ok()).toBeTruthy();

        // TODO: Alter this expect to check the exact response code, and add
        // setting the variables as userid from response

        // Setup the new User's Context, now that it exists
        const userContext = await playwright.request.newContext({
            baseURL: 'http://localhost:8080',
        });

        // Login as the new user
        const userFormData = {
            username: newUsername,
            password: defaultPassword,
        };

        const loginUserResponse = await userContext.post('/login', { multipart: userFormData });
        expect(loginUserResponse.ok()).toBeTruthy();

        // Yield (forward) the new user's info to the test
        await use({
            request: userContext,
            username: newUsername,
            password: defaultPassword,
        })

        // Cleanup the contexts after the test finishes
        await userContext.dispose();

        // Delete the user via API to cleanup the DB
        const deleteUserResponse = await adminContext.delete(`/api/users/deleteByUsername/${newUsername}`);
        expect(await deleteUserResponse.text()).toBe('success');

        await adminContext.dispose();
    }, { scope: 'worker' }], 
});

export { expect } from "@playwright/test";