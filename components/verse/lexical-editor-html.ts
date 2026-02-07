/**
 * Lexical editor HTML for WebView
 * This is inlined to avoid asset loading issues across platforms
 */
export function getLexicalEditorHtml(colors: {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Lexical Editor</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg: ${colors.bg};
      --surface: ${colors.surface};
      --surface-elevated: ${colors.surfaceElevated};
      --border: ${colors.border};
      --text: ${colors.text};
      --text-secondary: ${colors.textSecondary};
      --text-muted: ${colors.textMuted};
      --accent: ${colors.accent};
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 15px;
      line-height: 1.5;
      color: var(--text);
      background: transparent;
      -webkit-font-smoothing: antialiased;
      -webkit-tap-highlight-color: transparent;
      overflow: hidden;
    }

    #editor-wrapper {
      position: relative;
      width: 100%;
    }

    #editor-container {
      position: relative;
      width: 100%;
      min-height: 24px;
      max-height: 100px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    #editor {
      outline: none;
      min-height: 24px;
      padding: 0;
      font-size: 15px;
      line-height: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    #editor p {
      margin: 0;
      min-height: 20px;
    }

    #editor:empty::before {
      content: attr(data-placeholder);
      color: var(--text-muted);
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
    }

    /* Spoiler node styling */
    .spoiler-node {
      background-color: var(--surface-elevated);
      border-radius: 3px;
      padding: 0 3px;
      border-bottom: 1px dashed var(--text-muted);
    }

    /* Mention node styling */
    .mention-node {
      color: #3b82f6;
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
      font-weight: 500;
    }

    /* Mention dropdown - handled natively in React Native */
    #mention-dropdown {
      display: none;
    }
  </style>
</head>
<body>
  <div id="editor-wrapper">
    <div id="mention-dropdown"></div>
    <div id="editor-container">
      <div id="editor" contenteditable="true" data-placeholder="Share your reflection..."></div>
    </div>
  </div>

  <script>
    (function() {
      var editor = document.getElementById('editor');
      var mentionDropdown = document.getElementById('mention-dropdown');

      var mentionQuery = null;
      var mentionUsers = [];
      var selectedMentionIndex = 0;
      var isLoading = false;
      var mentionSearchTimeout = null;

      // Post message to React Native
      function postMessage(type, data) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({ type: type }, data || {})));
        }
      }

      // Convert editor content to Lexical JSON format
      function getEditorState() {
        var paragraphs = [];

        function processNode(node) {
          var children = [];

          function processInlineNodes(container) {
            Array.from(container.childNodes).forEach(function(child) {
              if (child.nodeType === Node.TEXT_NODE) {
                var text = child.textContent;
                // Filter out zero-width spaces used for cursor positioning
                if (text) {
                  text = text.replace(/\\u200B/g, '');
                  if (text) {
                    children.push({
                      type: 'text',
                      text: text,
                      format: 0,
                      detail: 0,
                      mode: 'normal',
                      style: '',
                      version: 1,
                    });
                  }
                }
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.classList && child.classList.contains('spoiler-node')) {
                  var spoilerChildren = [];
                  Array.from(child.childNodes).forEach(function(spoilerChild) {
                    if (spoilerChild.nodeType === Node.TEXT_NODE && spoilerChild.textContent) {
                      spoilerChildren.push({
                        type: 'text',
                        text: spoilerChild.textContent,
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      });
                    }
                  });
                  children.push({
                    type: 'spoiler',
                    children: spoilerChildren,
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  });
                } else if (child.classList && child.classList.contains('mention-node')) {
                  children.push({
                    type: 'mention',
                    userId: child.dataset.userId || '',
                    username: child.dataset.username || child.textContent.replace('@', ''),
                    version: 1,
                  });
                } else if (child.tagName === 'STRONG' || child.tagName === 'B') {
                  Array.from(child.childNodes).forEach(function(innerChild) {
                    if (innerChild.nodeType === Node.TEXT_NODE && innerChild.textContent) {
                      children.push({
                        type: 'text',
                        text: innerChild.textContent,
                        format: 1,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      });
                    }
                  });
                } else if (child.tagName === 'EM' || child.tagName === 'I') {
                  Array.from(child.childNodes).forEach(function(innerChild) {
                    if (innerChild.nodeType === Node.TEXT_NODE && innerChild.textContent) {
                      children.push({
                        type: 'text',
                        text: innerChild.textContent,
                        format: 2,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      });
                    }
                  });
                } else {
                  processInlineNodes(child);
                }
              }
            });
          }

          processInlineNodes(node);

          return {
            type: 'paragraph',
            children: children.length > 0 ? children : [{
              type: 'text',
              text: '',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          };
        }

        if (editor.children.length === 0) {
          paragraphs.push(processNode(editor));
        } else {
          Array.from(editor.childNodes).forEach(function(child) {
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'P') {
              paragraphs.push(processNode(child));
            } else if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent && child.textContent.trim())) {
              paragraphs.push(processNode(child));
            }
          });
        }

        if (paragraphs.length === 0) {
          paragraphs.push({
            type: 'paragraph',
            children: [{
              type: 'text',
              text: '',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          });
        }

        return {
          root: {
            type: 'root',
            children: paragraphs,
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        };
      }

      function getPlainText() {
        return editor.textContent || '';
      }

      function isEmpty() {
        return getPlainText().trim().length === 0;
      }

      function clearEditor() {
        editor.innerHTML = '';
        hideMentionDropdown();
        postMessage('change', { state: JSON.stringify(getEditorState()), isEmpty: true, length: 0 });
        postMessage('selectionChange', { hasSelection: false, isInsideSpoiler: false });
      }

      function focusEditor() {
        editor.focus();
        var range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // Restore editor from Lexical JSON state
      function setEditorState(stateObj) {
        if (!stateObj || !stateObj.root || !stateObj.root.children) {
          return;
        }

        editor.innerHTML = '';

        function renderNode(node) {
          if (node.type === 'text') {
            var textNode = document.createTextNode(node.text || '');
            // Handle formatting
            if (node.format) {
              var wrapper = textNode;
              if (node.format & 1) { // Bold
                var bold = document.createElement('strong');
                bold.appendChild(wrapper);
                wrapper = bold;
              }
              if (node.format & 2) { // Italic
                var italic = document.createElement('em');
                italic.appendChild(wrapper);
                wrapper = italic;
              }
              if (node.format & 8) { // Underline
                var underline = document.createElement('u');
                underline.appendChild(wrapper);
                wrapper = underline;
              }
              return wrapper;
            }
            return textNode;
          }

          if (node.type === 'mention') {
            var mentionSpan = document.createElement('span');
            mentionSpan.className = 'mention-node';
            mentionSpan.dataset.userId = node.userId || '';
            mentionSpan.dataset.username = node.username || '';
            mentionSpan.textContent = '@' + (node.username || '');
            mentionSpan.contentEditable = 'false';
            return mentionSpan;
          }

          if (node.type === 'spoiler') {
            var spoilerSpan = document.createElement('span');
            spoilerSpan.className = 'spoiler-node';
            if (node.children) {
              node.children.forEach(function(child) {
                var childEl = renderNode(child);
                if (childEl) spoilerSpan.appendChild(childEl);
              });
            }
            return spoilerSpan;
          }

          if (node.type === 'paragraph') {
            var p = document.createElement('p');
            if (node.children) {
              node.children.forEach(function(child) {
                var childEl = renderNode(child);
                if (childEl) p.appendChild(childEl);
              });
            }
            return p;
          }

          return null;
        }

        stateObj.root.children.forEach(function(child) {
          var el = renderNode(child);
          if (el) {
            editor.appendChild(el);
          }
        });

        // Trigger change event to update React Native state
        var text = getPlainText();
        postMessage('change', {
          state: JSON.stringify(getEditorState()),
          isEmpty: isEmpty(),
          length: text.length,
        });
      }

      // Insert mention
      function insertMention(userId, username) {
        var sel = window.getSelection();
        if (!sel.rangeCount) return;

        var range = sel.getRangeAt(0);

        if (mentionQuery !== null) {
          var textNode = range.startContainer;
          if (textNode.nodeType === Node.TEXT_NODE) {
            var text = textNode.textContent;
            var cursorPos = range.startOffset;

            var atPos = -1;
            for (var i = cursorPos - 1; i >= 0; i--) {
              if (text[i] === '@') {
                atPos = i;
                break;
              }
            }

            if (atPos >= 0) {
              textNode.textContent = text.slice(0, atPos) + text.slice(cursorPos);
              range.setStart(textNode, atPos);
              range.setEnd(textNode, atPos);
            }
          }
        }

        var mentionSpan = document.createElement('span');
        mentionSpan.className = 'mention-node';
        mentionSpan.dataset.userId = userId;
        mentionSpan.dataset.username = username;
        mentionSpan.textContent = '@' + username;
        mentionSpan.contentEditable = 'false';

        range.insertNode(mentionSpan);

        var space = document.createTextNode(' ');
        mentionSpan.after(space);
        range.setStartAfter(space);
        range.setEndAfter(space);
        sel.removeAllRanges();
        sel.addRange(range);

        hideMentionDropdown();
        onContentChange();
      }

      // Toggle spoiler on current selection
      function toggleSpoiler() {
        var sel = window.getSelection();
        if (!sel.rangeCount || sel.isCollapsed) return;

        var range = sel.getRangeAt(0);
        var selectedText = range.toString();

        if (!selectedText.trim()) return;

        var ancestor = range.commonAncestorContainer;
        var spoilerParent = null;

        if (ancestor.nodeType === Node.ELEMENT_NODE) {
          if (ancestor.classList && ancestor.classList.contains('spoiler-node')) {
            spoilerParent = ancestor;
          } else if (ancestor.closest) {
            spoilerParent = ancestor.closest('.spoiler-node');
          }
        } else if (ancestor.parentElement) {
          spoilerParent = ancestor.parentElement.closest ? ancestor.parentElement.closest('.spoiler-node') : null;
        }

        if (spoilerParent) {
          // Remove spoiler - unwrap contents
          var parent = spoilerParent.parentNode;
          var firstChild = spoilerParent.firstChild;
          var lastChild = spoilerParent.lastChild;
          while (spoilerParent.firstChild) {
            parent.insertBefore(spoilerParent.firstChild, spoilerParent);
          }
          parent.removeChild(spoilerParent);

          // Place cursor after the unwrapped content
          if (lastChild) {
            var newRange = document.createRange();
            if (lastChild.nodeType === Node.TEXT_NODE) {
              newRange.setStart(lastChild, lastChild.textContent.length);
              newRange.setEnd(lastChild, lastChild.textContent.length);
            } else {
              newRange.setStartAfter(lastChild);
              newRange.setEndAfter(lastChild);
            }
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        } else {
          // Add spoiler
          var spoilerSpan = document.createElement('span');
          spoilerSpan.className = 'spoiler-node';

          try {
            range.surroundContents(spoilerSpan);
          } catch (e) {
            var content = range.extractContents();
            spoilerSpan.appendChild(content);
            range.insertNode(spoilerSpan);
          }

          // Insert a zero-width space after the spoiler to escape
          var escapeSpace = document.createTextNode('\\u200B');
          if (spoilerSpan.nextSibling) {
            spoilerSpan.parentNode.insertBefore(escapeSpace, spoilerSpan.nextSibling);
          } else {
            spoilerSpan.parentNode.appendChild(escapeSpace);
          }

          // Move cursor after the escape character
          var newRange = document.createRange();
          newRange.setStartAfter(escapeSpace);
          newRange.setEndAfter(escapeSpace);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }

        onContentChange();
        checkSelection();
      }

      // Mention dropdown functions
      function showMentionDropdown() {
        // Don't show WebView dropdown - use native dropdown instead
        postMessage('mentionShow', {});
      }

      function hideMentionDropdown() {
        mentionQuery = null;
        mentionUsers = [];
        selectedMentionIndex = 0;
        isLoading = false;
        postMessage('mentionHide', {});
      }

      // renderMentionDropdown is no longer needed - using native React Native dropdown

      function onContentChange() {
        var state = getEditorState();
        var text = getPlainText();
        postMessage('change', {
          state: JSON.stringify(state),
          isEmpty: isEmpty(),
          length: text.length,
        });
      }

      function checkMentionTrigger() {
        var sel = window.getSelection();
        if (!sel.rangeCount) return;

        var range = sel.getRangeAt(0);
        if (!range.collapsed) {
          hideMentionDropdown();
          return;
        }

        var textNode = range.startContainer;
        if (textNode.nodeType !== Node.TEXT_NODE) {
          hideMentionDropdown();
          return;
        }

        var text = textNode.textContent;
        var cursorPos = range.startOffset;

        var atPos = -1;
        for (var i = cursorPos - 1; i >= 0; i--) {
          var char = text[i];
          if (char === '@') {
            if (i === 0 || /\\s/.test(text[i - 1])) {
              atPos = i;
            }
            break;
          }
          if (/\\s/.test(char)) {
            break;
          }
        }

        if (atPos >= 0) {
          var query = text.slice(atPos + 1, cursorPos);
          if (query !== mentionQuery) {
            mentionQuery = query;
            selectedMentionIndex = 0;

            clearTimeout(mentionSearchTimeout);
            if (query.length > 0) {
              isLoading = true;
              mentionSearchTimeout = setTimeout(function() {
                postMessage('mentionSearch', { query: query });
              }, 200);
            } else {
              // Just @ typed, show empty state or wait for more input
              postMessage('mentionSearch', { query: '' });
            }
          }
        } else {
          if (mentionQuery !== null) {
            hideMentionDropdown();
          }
        }
      }

      // Check selection and notify React Native
      function checkSelection() {
        var sel = window.getSelection();
        var hasSelection = sel.rangeCount > 0 && !sel.isCollapsed && sel.toString().trim().length > 0;
        var isInsideSpoiler = false;

        if (hasSelection) {
          var range = sel.getRangeAt(0);
          var ancestor = range.commonAncestorContainer;

          if (ancestor.nodeType === Node.ELEMENT_NODE) {
            isInsideSpoiler = (ancestor.classList && ancestor.classList.contains('spoiler-node')) ||
                             (ancestor.closest && !!ancestor.closest('.spoiler-node'));
          } else if (ancestor.parentElement) {
            isInsideSpoiler = !!ancestor.parentElement.closest('.spoiler-node');
          }
        }

        postMessage('selectionChange', { hasSelection: hasSelection, isInsideSpoiler: isInsideSpoiler });
      }

      // Event listeners
      editor.addEventListener('input', function() {
        onContentChange();
        checkMentionTrigger();
      });

      editor.addEventListener('keydown', function(e) {
        // Close mention dropdown on Escape
        if (e.key === 'Escape' && mentionQuery !== null) {
          e.preventDefault();
          hideMentionDropdown();
          return;
        }
      });

      editor.addEventListener('keyup', function(e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) !== -1) {
          checkMentionTrigger();
        }
      });

      editor.addEventListener('click', function() {
        setTimeout(checkMentionTrigger, 0);
      });

      editor.addEventListener('focus', function() {
        postMessage('focus', {});
      });

      editor.addEventListener('blur', function() {
        setTimeout(function() {
          if (!mentionDropdown.matches(':hover')) {
            hideMentionDropdown();
          }
        }, 150);
        postMessage('blur', {});
      });

      document.addEventListener('selectionchange', function() {
        setTimeout(checkSelection, 10);
      });

      document.addEventListener('click', function(e) {
        if (!mentionDropdown.contains(e.target) && !editor.contains(e.target)) {
          hideMentionDropdown();
        }
      });

      // Handle messages from React Native
      function handleMessage(e) {
        try {
          var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

          switch (data.type) {
            case 'setPlaceholder':
              editor.dataset.placeholder = data.placeholder || '';
              break;
            case 'clear':
              clearEditor();
              break;
            case 'focus':
              focusEditor();
              break;
            case 'blur':
              editor.blur();
              break;
            case 'insertAtSymbol':
              focusEditor();
              document.execCommand('insertText', false, '@');
              checkMentionTrigger();
              break;
            case 'toggleSpoiler':
              toggleSpoiler();
              break;
            case 'mentionResults':
              mentionUsers = data.users || [];
              isLoading = false;
              selectedMentionIndex = 0;
              break;
            case 'selectMention':
              if (data.userId && data.username) {
                insertMention(data.userId, data.username);
              }
              break;
            case 'getState':
              postMessage('stateResult', {
                state: JSON.stringify(getEditorState()),
                isEmpty: isEmpty(),
                length: getPlainText().length,
              });
              break;
            case 'setState':
              if (data.state) {
                try {
                  var stateObj = typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
                  setEditorState(stateObj);
                } catch (err) {
                  console.error('setState parse error:', err);
                }
              }
              break;
          }
        } catch (err) {
          console.error('Message parse error:', err);
        }
      }

      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage);

      postMessage('ready', {});
    })();
  </script>
</body>
</html>`;
}
