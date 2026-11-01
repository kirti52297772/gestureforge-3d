
export function setupVisibility(parts) {
  const visibilityPanel = document.createElement('section');

  visibilityPanel.className = 'panel';

  visibilityPanel.innerHTML = `
    <h2>Component Visibility</h2>
    <p class="hint">Show or hide individual assembly components.</p>
    <div id="visibilityList"></div>
    <button class="action primary" id="showAllParts">
      Show All Components
    </button>
  `;

  document.querySelector('.side').appendChild(visibilityPanel);

  const visibilityList = visibilityPanel.querySelector('#visibilityList');

  const visibilityGroups = new Map();

  // Group meshes belonging to the same component.
  parts.forEach(({ mesh }) => {
    const name =
      mesh.userData.selectableName ||
      mesh.userData.partName ||
      'Machine Component';

    if (!visibilityGroups.has(name)) {
      visibilityGroups.set(name, []);
    }

    visibilityGroups.get(name).push(mesh);
  });

  // Create one checkbox for each component.
  visibilityGroups.forEach((meshes, name) => {
    const label = document.createElement('label');

    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '10px';
    label.style.padding = '8px 0';
    label.style.cursor = 'pointer';

    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.checked = true;

    const nameText = document.createElement('span');
    nameText.textContent = name;

    checkbox.addEventListener('change', () => {
      meshes.forEach(mesh => {
        mesh.visible = checkbox.checked;
      });
    });

    label.appendChild(checkbox);
    label.appendChild(nameText);

    visibilityList.appendChild(label);
  });

  // Show all components.
  visibilityPanel
    .querySelector('#showAllParts')
    .addEventListener('click', () => {
      visibilityList
        .querySelectorAll('input[type="checkbox"]')
        .forEach(checkbox => {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change'));
        });
    });

  return {
    visibilityPanel
  };
}
