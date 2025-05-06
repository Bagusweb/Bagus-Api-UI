document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const body = document.body;
    body.classList.add("no-scroll");

    // Animated loading dots
    const loadingDotsAnimation = setInterval(() => {
        const loadingDots = document.querySelector(".loading-dots");
        if (loadingDots) {
            if (loadingDots.textContent === '...') {
                loadingDots.textContent = '.';
            } else {
                loadingDots.textContent += '.';
            }
        }
    }, 500);

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Theme toggle functionality
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update icon with animation
        const btn = document.getElementById('themeToggleBtn');
        btn.classList.add('theme-toggle-spin');
        setTimeout(() => {
            btn.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            setTimeout(() => {
                btn.classList.remove('theme-toggle-spin');
            }, 150);
        }, 150);
    });

    // Clear search button functionality
    document.getElementById('clearSearch').addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        searchInput.focus();
        // Trigger input event to update the search results
        searchInput.dispatchEvent(new Event('input'));
    });

    // Copy to clipboard functionality
    document.getElementById('copyEndpoint').addEventListener('click', () => {
        copyToClipboard('apiEndpoint');
    });
    
    document.getElementById('copyResponse').addEventListener('click', () => {
        copyToClipboard('apiResponseContent');
    });

    function copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = elementId === 'apiEndpoint' ? 
                document.getElementById('copyEndpoint') : 
                document.getElementById('copyResponse');
            
            // Show success animation
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.add('copy-success');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="far fa-copy"></i>';
                btn.classList.remove('copy-success');
            }, 1500);
        });
    }

    try {
        const settings = await fetch('/src/settings.json').then(res => res.json());

        const setContent = (id, property, value) => {
            const element = document.getElementById(id);
            if (element) element[property] = value;
        };
        
        // Set page content from settings
        setContent('page', 'textContent', settings.name || "Bagus-Api");
        setContent('wm', 'textContent', `© ${new Date().getFullYear()} ${settings.apiSettings.creator}. All rights reserved.` || `© ${new Date().getFullYear()} BagusWeb. All rights reserved.`);
        setContent('header', 'textContent', settings.name || "Bagus UI");
        setContent('name', 'textContent', settings.name || "Bagus UI");
        setContent('version', 'textContent', settings.version || "v1.0");
        setContent('versionHeader', 'textContent', settings.header.status || "Active!");
        setContent('description', 'textContent', settings.description || "Simple API's");

        // Set banner image
        const dynamicImage = document.getElementById('dynamicImage');
        if (dynamicImage && settings.bannerImage) {
            dynamicImage.src = settings.bannerImage;
        }

        // Set links
        const apiLinksContainer = document.getElementById('apiLinks');
        if (apiLinksContainer && settings.links?.length) {
            settings.links.forEach(({ url, name }) => {
                const link = Object.assign(document.createElement('a'), {
                    href: url,
                    textContent: name,
                    target: '_blank',
                    className: 'api-link'
                });
                apiLinksContainer.appendChild(link);
            });
        }

        // Create API content
        const apiContent = document.getElementById('apiContent');
        settings.categories.forEach((category) => {
            const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name));
            
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-section';
            
            const categoryHeader = document.createElement('h3');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category.name;
            categoryElement.appendChild(categoryHeader);
            
            // Add category image (new feature)
            
            const itemsRow = document.createElement('div');
            itemsRow.className = 'row';
            
            sortedItems.forEach((item, index) => {
                const itemCol = document.createElement('div');
                itemCol.className = 'col-md-6 col-lg-4 api-item';
                itemCol.dataset.name = item.name;
                itemCol.dataset.desc = item.desc;
                
                const heroSection = document.createElement('div');
                heroSection.className = 'hero-section';
                
                const infoDiv = document.createElement('div');
                
                const itemTitle = document.createElement('h5');
                itemTitle.className = 'mb-0';
                itemTitle.textContent = item.name;
                
                const itemDesc = document.createElement('p');
                itemDesc.className = 'text-muted mb-0';
                itemDesc.textContent = item.desc;
                
                infoDiv.appendChild(itemTitle);
                infoDiv.appendChild(itemDesc);
                
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'api-actions';
                
                const getBtn = document.createElement('button');
                getBtn.className = 'btn get-api-btn';
                getBtn.textContent = 'GET';
                getBtn.dataset.apiPath = item.path;
                getBtn.dataset.apiName = item.name;
                getBtn.dataset.apiDesc = item.desc;
                
                // Add API status indicator (new feature)
                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'api-status';
                
                // Set status based on item.status (or default to "ready")
                const status = item.status || "ready";
                let statusClass, statusIcon;
                
                switch(status) {
                    case "error":
                        statusClass = "status-error";
                        statusIcon = "fa-exclamation-triangle";
                        break;
                    case "update":
                        statusClass = "status-update";
                        statusIcon = "fa-arrow-up";
                        break;
                    default: // "ready"
                        statusClass = "status-ready";
                        statusIcon = "fa-circle";
                }
                
                statusIndicator.classList.add(statusClass);
                const icon = document.createElement('i');
                icon.className = `fas ${statusIcon}`;
                statusIndicator.appendChild(icon);
                
                const statusText = document.createElement('span');
                statusText.textContent = status;
                statusIndicator.appendChild(statusText);
                
                actionsDiv.appendChild(getBtn);
                actionsDiv.appendChild(statusIndicator);
                
                heroSection.appendChild(infoDiv);
                heroSection.appendChild(actionsDiv);
                
                itemCol.appendChild(heroSection);
                itemsRow.appendChild(itemCol);
                
                // Add animation delay for staggered appearance
                itemCol.style.animationDelay = `${index * 0.05}s`;
            });
            
            categoryElement.appendChild(itemsRow);
            apiContent.appendChild(categoryElement);
        });

        // Search functionality with improved UX
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            // Show/hide clear button based on search input
            if (searchTerm.length > 0) {
                clearSearchBtn.style.opacity = '1';
                clearSearchBtn.style.pointerEvents = 'auto';
            } else {
                clearSearchBtn.style.opacity = '0';
                clearSearchBtn.style.pointerEvents = 'none';
            }
            
            const apiItems = document.querySelectorAll('.api-item');
            const categoryHeaders = document.querySelectorAll('.category-header');
            const categoryImages = document.querySelectorAll('.category-image');

            apiItems.forEach(item => {
                const name = item.getAttribute('data-name').toLowerCase();
                const desc = item.getAttribute('data-desc').toLowerCase();
                
                if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                    item.style.display = '';
                    item.classList.add('search-match');
                    setTimeout(() => item.classList.remove('search-match'), 800);
                } else {
                    item.style.display = 'none';
                }
            });

            categoryHeaders.forEach((header, index) => {
                const categorySection = header.closest('.category-section');
                const categoryRow = categorySection.querySelector('.row');
                const visibleItems = categoryRow.querySelectorAll('.api-item:not([style*="display: none"])');
                
                if (visibleItems.length) {
                    categorySection.style.display = '';
                    if (categoryImages[index]) {
                        categoryImages[index].style.display = '';
                    }
                } else {
                    categorySection.style.display = 'none';
                    if (categoryImages[index]) {
                        categoryImages[index].style.display = 'none';
                    }
                }
            });
            
            // Show no results message if needed
            const visibleSections = document.querySelectorAll('.category-section[style*="display: "][style*="none"]');
            const noResultsMsg = document.getElementById('noResultsMessage');
            
            if (visibleSections.length === document.querySelectorAll('.category-section').length && searchTerm.length > 0) {
                if (!noResultsMsg) {
                    const message = document.createElement('div');
                    message.id = 'noResultsMessage';
                    message.className = 'no-results-message';
                    message.innerHTML = `
                        <i class="fas fa-search"></i>
                        <p>No results found for "<span>${searchTerm}</span>"</p>
                        <button id="clearSearchFromMsg" class="btn">Clear Search</button>
                    `;
                    apiContent.appendChild(message);
                    
                    document.getElementById('clearSearchFromMsg').addEventListener('click', () => {
                        searchInput.value = '';
                        searchInput.dispatchEvent(new Event('input'));
                        searchInput.focus();
                    });
                } else {
                    noResultsMsg.querySelector('span').textContent = searchTerm;
                    noResultsMsg.style.display = 'flex';
                }
            } else if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        });

        // API Button click handler with improved UX
        document.addEventListener('click', event => {
            if (!event.target.classList.contains('get-api-btn')) return;

            const { apiPath, apiName, apiDesc } = event.target.dataset;
            const modal = new bootstrap.Modal(document.getElementById('apiResponseModal'));
            const modalRefs = {
                label: document.getElementById('apiResponseModalLabel'),
                desc: document.getElementById('apiResponseModalDesc'),
                content: document.getElementById('apiResponseContent'),
                container: document.getElementById('responseContainer'),
                endpoint: document.getElementById('apiEndpoint'),
                spinner: document.getElementById('apiResponseLoading'),
                queryInputContainer: document.getElementById('apiQueryInputContainer'),
                submitBtn: document.getElementById('submitQueryBtn')
            };

            // Reset modal with animation
            modalRefs.label.textContent = apiName;
            modalRefs.desc.textContent = apiDesc;
            modalRefs.content.textContent = '';
            modalRefs.endpoint.textContent = '';
            modalRefs.spinner.classList.add('d-none');
            modalRefs.content.classList.add('d-none');
            modalRefs.container.classList.add('d-none');
            modalRefs.endpoint.classList.add('d-none');

            modalRefs.queryInputContainer.innerHTML = '';
            modalRefs.submitBtn.classList.add('d-none');

            let baseApiUrl = `${window.location.origin}${apiPath}`;
            let params = new URLSearchParams(apiPath.split('?')[1]);
            let hasParams = params.toString().length > 0;

            if (hasParams) {
                // Create input fields for parameters with improved styling
                const paramContainer = document.createElement('div');
                paramContainer.className = 'param-container';

                const paramsArray = Array.from(params.keys());
                
                const formTitle = document.createElement('h6');
                formTitle.className = 'param-form-title';
                formTitle.innerHTML = '<i class="fas fa-sliders-h"></i> Parameters';
                paramContainer.appendChild(formTitle);
                
                paramsArray.forEach((param, index) => {
                    const paramGroup = document.createElement('div');
                    paramGroup.className = index < paramsArray.length - 1 ? 'mb-3 param-group' : 'param-group';

                    // Create label with animated focus effect
                    const labelContainer = document.createElement('div');
                    labelContainer.className = 'param-label-container';
                    
                    const label = document.createElement('label');
                    label.className = 'form-label';
                    label.textContent = param;
                    label.htmlFor = `param-${param}`;
                    
                    // Add required indicator
                    const requiredSpan = document.createElement('span');
                    requiredSpan.className = 'required-indicator';
                    requiredSpan.textContent = '*';
                    label.appendChild(requiredSpan);
                    
                    labelContainer.appendChild(label);
                    
                    // Add parameter description tooltip if available
                    const currentItem = settings.categories
                        .flatMap(category => category.items)
                        .find(item => item.path === apiPath);
                    
                    if (currentItem && currentItem.params && currentItem.params[param]) {
                        const tooltipIcon = document.createElement('i');
                        tooltipIcon.className = 'fas fa-info-circle param-info';
                        tooltipIcon.title = currentItem.params[param];
                        labelContainer.appendChild(tooltipIcon);
                    }
                    
                    paramGroup.appendChild(labelContainer);
                    
                    // Create input with floating label effect
                    const inputContainer = document.createElement('div');
                    inputContainer.className = 'input-container';
                    
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.className = 'form-control custom-input';
                    inputField.id = `param-${param}`;
                    inputField.placeholder = `Enter ${param}...`;
                    inputField.dataset.param = param;
                    inputField.required = true;
                    inputField.addEventListener('input', validateInputs);
                    
                    inputContainer.appendChild(inputField);
                    paramGroup.appendChild(inputContainer);
                    paramContainer.appendChild(paramGroup);
                });
                
                // Check for inner description
                const currentItem = settings.categories
                    .flatMap(category => category.items)
                    .find(item => item.path === apiPath);

                if (currentItem && currentItem.innerDesc) {
                    const innerDescDiv = document.createElement('div');
                    innerDescDiv.className = 'inner-desc';
                    innerDescDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${currentItem.innerDesc.replace(/\n/g, '<br>')}`;
                    paramContainer.appendChild(innerDescDiv);
                }

               modalRefs.queryInputContainer.appendChild(paramContainer);
                modalRefs.submitBtn.classList.remove('d-none');

                // Submit button handler with improved feedback
                modalRefs.submitBtn.onclick = async () => {
                    const inputs = modalRefs.queryInputContainer.querySelectorAll('input');
                    const newParams = new URLSearchParams();
                    let isValid = true;

                    inputs.forEach(input => {
                        if (!input.value.trim()) {
                            isValid = false;
                            input.classList.add('is-invalid');
                            input.parentElement.classList.add('shake-animation');
                            setTimeout(() => {
                                input.parentElement.classList.remove('shake-animation');
                            }, 500);
                        } else {
                            input.classList.remove('is-invalid');
                            newParams.append(input.dataset.param, input.value.trim());
                        }
                    });

                    if (!isValid) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'alert alert-danger mt-3 fade-in';
                        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
                        
                        // Remove existing error message if any
                        const existingError = modalRefs.queryInputContainer.querySelector('.alert');
                        if (existingError) existingError.remove();
                        
                        modalRefs.queryInputContainer.appendChild(errorMsg);
                        return;
                    }

                    // Show loading animation
                    modalRefs.submitBtn.disabled = true;
                    modalRefs.submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

                    const apiUrlWithParams = `${window.location.origin}${apiPath.split('?')[0]}?${newParams.toString()}`;
                    
                    // Animated transition
                    modalRefs.queryInputContainer.style.opacity = '0';
                    setTimeout(() => {
                        modalRefs.queryInputContainer.innerHTML = '';
                        modalRefs.queryInputContainer.style.opacity = '1';
                        modalRefs.submitBtn.classList.add('d-none');
                        handleApiRequest(apiUrlWithParams, modalRefs, apiName);
                    }, 300);
                };
            } else {
                handleApiRequest(baseApiUrl, modalRefs, apiName);
            }

            modal.show();
        });

        // Input validation with visual feedback
        function validateInputs() {
            const submitBtn = document.getElementById('submitQueryBtn');
            const inputs = document.querySelectorAll('.param-container input');
            const isValid = Array.from(inputs).every(input => input.value.trim() !== '');
            
            if (isValid) {
                submitBtn.disabled = false;
                submitBtn.classList.add('btn-active');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.remove('btn-active');
            }
            
            // Remove validation error on input
            this.classList.remove('is-invalid');
            
            // Remove error message when user starts typing
            const errorMsg = document.querySelector('.alert.alert-danger');
            if (errorMsg && this.value.trim() !== '') {
                errorMsg.classList.add('fade-out');
                setTimeout(() => errorMsg.remove(), 300);
            }
        }

        // Handle API request with improved animations and error handling
        async function handleApiRequest(apiUrl, modalRefs, apiName) {
            modalRefs.spinner.classList.remove('d-none');
            modalRefs.container.classList.add('d-none');
            
            // Display the endpoint with typing animation
            modalRefs.endpoint.textContent = '';
            modalRefs.endpoint.classList.remove('d-none');
            
            const typingSpeed = 30; // ms per character
            const endpointText = apiUrl;
            let charIndex = 0;
            
            const typeEndpoint = () => {
                if (charIndex < endpointText.length) {
                    modalRefs.endpoint.textContent += endpointText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeEndpoint, typingSpeed);
                }
            };
            
            typeEndpoint();

            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.startsWith('image/')) {
                    // Handle image response with fade-in animation
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = apiName;
                    img.className = 'response-image fade-in';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.borderRadius = '10px';
                    img.style.boxShadow = 'var(--shadow)';

                    modalRefs.content.innerHTML = '';
                    modalRefs.content.appendChild(img);
                } else {
                    // Handle JSON response with syntax highlighting and animation
                    const data = await response.json();
                    
                    // Pretty-print JSON with syntax highlighting
                    const formattedJson = syntaxHighlight(JSON.stringify(data, null, 2));
                    modalRefs.content.innerHTML = formattedJson;
                    
                    // Add code folding for large responses
                    if (JSON.stringify(data, null, 2).split('\n').length > 20) {
                        addCodeFolding(modalRefs.content);
                    }
                }

                modalRefs.container.classList.remove('d-none');
                modalRefs.content.classList.remove('d-none');
                
                // Animate the response container
                modalRefs.container.classList.add('slide-in-bottom');
            } catch (error) {
                // Enhanced error display
                const errorContainer = document.createElement('div');
                errorContainer.className = 'error-container fade-in';
                
                const errorIcon = document.createElement('div');
                errorIcon.className = 'error-icon';
                errorIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `<h6>Error Occurred</h6><p>${error.message}</p>`;
                
                errorContainer.appendChild(errorIcon);
                errorContainer.appendChild(errorMessage);
                
                modalRefs.content.innerHTML = '';
                modalRefs.content.appendChild(errorContainer);
                modalRefs.container.classList.remove('d-none');
                modalRefs.content.classList.remove('d-none');
            } finally {
                modalRefs.spinner.classList.add('d-none');
            }
        }
        
        // Add code folding functionality for large JSON responses
        function addCodeFolding(container) {
            const codeLines = container.innerHTML.split('\n');
            let foldableContent = '';
            let inObject = false;
            let objectLevel = 0;
            let foldedLineCount = 0;
            
            for (let i = 0; i < codeLines.length; i++) {
                const line = codeLines[i];
                
                if (line.includes('{') && !line.includes('}')) {
                    if (!inObject) {
                        foldableContent += `<div class="code-fold-trigger" data-folded="false">${line}</div>`;
                        foldableContent += '<div class="code-fold-content">';
                        inObject = true;
                        objectLevel = 1;
                    } else {
                        foldableContent += line + '\n';
                        objectLevel++;
                    }
                } else if (line.includes('}') && !line.includes('{')) {
                    objectLevel--;
                    if (objectLevel === 0 && inObject) {
                        foldableContent += line + '\n';
                        foldableContent += '</div>';
                        inObject = false;
                    } else {
                        foldableContent += line + '\n';
                    }
                } else {
                    if (inObject) {
                        foldableContent += line + '\n';
                        foldedLineCount++;
                    } else {
                        foldableContent += line + '\n';
                    }
                }
            }
            
            container.innerHTML = foldableContent;
            
            // Add click handlers for fold/unfold
            const foldTriggers = container.querySelectorAll('.code-fold-trigger');
            foldTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const isFolded = trigger.getAttribute('data-folded') === 'true';
                    const content = trigger.nextElementSibling;
                    
                    if (isFolded) {
                        // Unfold
                        content.style.display = 'block';
                        trigger.setAttribute('data-folded', 'false');
                        trigger.classList.remove('folded');
                    } else {
                        // Fold
                        content.style.display = 'none';
                        trigger.setAttribute('data-folded', 'true');
                        trigger.classList.add('folded');
                    }
                });
                
                // Add fold icon and count
                if (trigger.nextElementSibling.classList.contains('code-fold-content')) {
                    const lineCount = trigger.nextElementSibling.innerHTML.split('\n').length - 1;
                    const foldIndicator = document.createElement('span');
                    foldIndicator.className = 'fold-indicator';
                    foldIndicator.innerHTML = `<i class="fas fa-chevron-down"></i> ${lineCount} lines`;
                    trigger.appendChild(foldIndicator);
                }
            });
        }
        
        // Enhanced JSON syntax highlighting
        function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        
        // Show error notification
        const errorNotification = document.createElement('div');
        errorNotification.className = 'error-notification';
        errorNotification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load settings: ${error.message}</p>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(errorNotification);
        
        // Add notification close button functionality
        errorNotification.querySelector('.close-notification').addEventListener('click', () => {
            errorNotification.classList.add('notification-hide');
            setTimeout(() => errorNotification.remove(), 300);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorNotification.classList.add('notification-hide');
            setTimeout(() => errorNotification.remove(), 300);
        }, 5000);
    } finally {
        // Add animation to loading screen disappearance
        clearInterval(loadingDotsAnimation);
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                loadingScreen.style.display = "none";
                body.classList.remove("no-scroll");
            }, 500);
        }, 1500);
    }
});

// Scroll event for navbar with improved animations
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const navbarBrand = document.querySelector('.navbar-brand');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbarBrand.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        navbarBrand.classList.remove('visible');
    }
    
    // Animate in API items as they come into view
    const apiItems = document.querySelectorAll('.api-item');
    apiItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect();
        
        // Check if item is in viewport
        if (itemPosition.top < window.innerHeight - 100) {
            item.classList.add('in-view');
        }
    });
});

// Initialize tooltips
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});               