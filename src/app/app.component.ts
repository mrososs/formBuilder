import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <div class="app-header">
        <div class="header-content">
          <h1 class="app-title">Form Builder</h1>
          <p class="app-subtitle">
            Create beautiful forms with drag & drop interface
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
            <span class="nav-text">Form Builder</span>
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        text-align: left;
      }

      .app-title {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .app-subtitle {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.9);
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
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: rgba(255, 255, 255, 0.3);
        color: white;
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .nav-icon {
        width: 20px;
        height: 20px;
      }

      .nav-text {
        font-weight: 500;
      }

      .app-main {
        flex: 1;
        overflow: hidden;
      }

      /* Tablet Responsive */
      @media (max-width: 1024px) {
        .app-header {
          padding: 16px 20px;
        }

        .app-title {
          font-size: 1.75rem;
        }

        .app-subtitle {
          font-size: 0.9rem;
        }

        .nav-link {
          padding: 10px 16px;
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .app-header {
          flex-direction: column;
          gap: 16px;
          text-align: center;
          padding: 16px 20px;
        }

        .header-content {
          text-align: center;
        }

        .app-title {
          font-size: 1.5rem;
        }

        .app-subtitle {
          font-size: 0.85rem;
        }

        .app-navigation {
          width: 100%;
          justify-content: center;
        }

        .nav-link {
          padding: 8px 12px;
        }

        .nav-text {
          display: none;
        }
      }

      /* Small Mobile */
      @media (max-width: 480px) {
        .app-header {
          padding: 12px 16px;
        }

        .app-title {
          font-size: 1.25rem;
        }

        .app-subtitle {
          font-size: 0.8rem;
        }
      }

      /* Landscape Mobile */
      @media (max-width: 768px) and (orientation: landscape) {
        .app-header {
          flex-direction: row;
          padding: 12px 20px;
        }

        .header-content {
          text-align: left;
        }

        .app-navigation {
          width: auto;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'formBuilder-custom';
}
