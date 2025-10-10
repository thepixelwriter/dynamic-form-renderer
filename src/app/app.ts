import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: `
        <div class="min-vh-100 bg-light">
            <nav class="navbar navbar-dark bg-primary mb-4">
                <div class="container">
                    <span class="navbar-brand">Dynamic Form Renderer</span>
                </div>
            </nav>
            <main class="container">
                <router-outlet></router-outlet>
            </main>
        </div>
    `
})
export class App {}
