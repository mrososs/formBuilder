import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <div class="app-header">
        <div class="header-content">
          <h1 class="app-title">Form Builder & Workflow Designer</h1>
          <p class="app-subtitle">
            Create forms and design workflows with ease
          </p>
        </div>
        <nav class="app-navigation">
          <a
            routerLink="/form-builder"
            routerLinkActive="active"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Form Builder
          </a>
          <a
            routerLink="/workflow-designer"
            routerLinkActive="active"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            Workflow Designer
          </a>
        </nav>
      </div>
      <div class="app-main">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: white;
        overflow: hidden;
      }

      .app-header {
        padding: 20px 24px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-content {
        text-align: left;
      }

      .app-title {
        font-size: 2rem;
        font-weight: 700;
        color: black;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .app-subtitle {
        font-size: 1rem;
        color: #666;
        margin: 0;
        font-weight: 400;
      }

      .app-navigation {
        display: flex;
        gap: 16px;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 8px;
        text-decoration: none;
        color: #666;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .nav-link:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #333;
      }

      .nav-link.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .nav-icon {
        width: 20px;
        height: 20px;
      }

      .app-main {
        flex: 1;
        overflow: hidden;
      }

      @media (max-width: 768px) {
        .app-header {
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        .header-content {
          text-align: center;
        }

        .app-navigation {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'formBuilder-custom';
}
