import { expect } from '@playwright/test';
import { test as fixtureUser } from '../fixtures/user.fixture';

// Types we will be using in this fixture, Hero payloads
export interface HeroPayload {
    name: string;
    type: string;
    level: number;
    username: string;
}

export interface HeroResponse {
    heroId: string;
    name: string;
    type: string;
    level: number;
    username: string;
    createdAt: string;
}

// Declaration of custom fixture we have defined
type ApiFixtures = {
    newCustomHero: (customData?: Partial<HeroPayload>) => Promise<HeroResponse>;
};

export const test = fixtureUser.extend<{}, ApiFixtures>({

    newCustomHero: [async ({ newUser }, use) => {
        // We also use the original User for creation.
        const { request } = newUser;

        // Difference here is that we yield a FUNCTION to the test,
        // so we need to define it. It accepts either `customData` or a Partial 
        // payload (this means that we can send any part of the payload, missing ones
        // will be picked up from default data).

        // Since we don't know in advance how many heroes with which data will be
        // created, we must store created heroes if we wish to delete them later.
        const heroesForCleanup: HeroResponse[] = [];

        // Now we create the function we will forward to the test.
        const heroFactory = async (customData?: Partial<HeroPayload>) => {
            const heroPayload: HeroPayload = {
                name: "Zvonko",
                type: "Revenant",
                level: 34,
                username: newUser.username,
                ...customData,
            };

            // We send the request as before:
            const response = await request.post('/api/heroes/add', {
                data: heroPayload,
            });
            expect(response.ok()).toBeTruthy();

            const createdHero = await response.json();

            // Add the created hero for cleanup.
            heroesForCleanup.push(createdHero);

            // Send the created hero back to the test.
            return createdHero;
        };

        // A notable difference is that here we pass the FUNCTION to the test, not data.
        await use(heroFactory);

        // And cleanup the Hero after the test.
        for (const hero of heroesForCleanup) {
            const deleteHeroResponse = await request.delete(`/api/heroes/deleteByName/${hero.name}`);

            // Here we omit the `expect` because if it fails, the execution will stop and we will have
            // heroes that haven't been cleaned up. Instead, we log the failures and handle them manually.
            if (!deleteHeroResponse.ok()) {
                console.warn(`Cleanup for hero ${hero.name} failed!`);
            }
        }
    }, { scope: 'worker' }]

});

export { expect } from "@playwright/test";