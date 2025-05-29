/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: Cognos Analytics Home (C) Copyright IBM Corp. 2020, 2022
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define('ca-content/bridge/content/ContentPageView',['ca-content/content/content', '../nls/StringResources', 'react', 'react-dom'], function (content, StringResources, React, ReactDOM) {
  const MYFOLDERS_ID = '.my_folders';
  class ContentPageView {
    constructor(options) {
      this.glassContext = options.glassContext;
      this.el = options.$el && options.$el[0] || this._initDomElement();
      this.tab = options.tab;
      this.folder = options.folder;
      this.logger = this.glassContext.getCoreSvc('.Logger');
      this.eventRouter = this.glassContext.getCoreSvc('.Events');
      this.origin = options.origin;
      this.searchContent = options.searchContent;
      this.uploadHelper = new content.UploadHelper({
        glassContext: this.glassContext
      });
    }
    _getFolderData(folderPathRef) {
      const options = {
        dataType: 'json',
        type: 'GET',
        url: content.ContentServiceUrls.getPathURL(folderPathRef),
        data: {
          'fields': 'type,ancestors'
        }
      };
      return this.glassContext.getCoreSvc('.Ajax').ajax(options).then(objInfo => {
        const folder = objInfo.data.data[0];
        if (this._isTopLevel(folder)) {
          return {
            tab: this.tab || (folder.type === 'content' ? 'teamContent' : 'myContent')
          };
        } else {
          return {
            tab: this.tab || (folder.ancestors[0].type === 'content' ? 'teamContent' : 'myContent'),
            folder: folder.type === 'folder' || folder.type === 'package' ? folderPathRef : folder.ancestors.pop().id
          };
        }
      }).catch(error => {
        this.logger.error('Failed to retrieve objInfo for pathRef=' + folderPathRef, error);
        return Promise.resolve({
          tab: this.tab
        });
      });
    }
    _isTopLevel(objInfo) {
      return objInfo.ancestors.length > 0 ? objInfo.ancestors.filter(ancestor => ancestor.type === 'folder' || ancestor.type === 'content' || ancestor.id === MYFOLDERS_ID).length === 0 : true;
    }
    getFolderInfo() {
      return this.folder ? this._getFolderData(this.folder) : Promise.resolve({
        tab: this.tab
      });
    }
    render() {
      return this.getFolderInfo().then(folderInfo => {
        return this.uploadHelper.initialize().then(() => {
          const options = {
            glassContext: this.glassContext,
            tab: folderInfo.tab,
            folder: folderInfo.folder,
            uploadHelper: this.uploadHelper,
            onBrowserNavigate: this.updatePerspectiveContext.bind(this),
            origin: this.origin,
            searchContent: this.searchContent
          };
          ReactDOM.render(React.createElement(content.ContentPageView, options), this.el);
          return Promise.resolve();
        });
      });
    }
    activate(content) {
      this.updateContentPage(content);
      return Promise.resolve();
    }
    deactivate() {
      return Promise.resolve();
    }
    show() {
      this.el.setAttribute('style', 'display: block;');
      this.eventRouter.trigger('content:refresh');
    }
    setFocus() {}
    _initDomElement() {
      const el = document.createElement('div');
      el.classList.add('contentPageView');
      return el;
    }
    getTitle() {
      return StringResources.get('contentPageTitleLabel');
    }
    updatePerspectiveContext(context, options) {
      const isContentUpdated = this.updateContentPage(context.content, options);
      this.glassContext.currentPerspective.updateRenderState(!isContentUpdated);
    }
    updateContentPage(content, options = {}) {
      if (this.tab !== content.tab || this.folder !== content.folder) {
        this.tab = content.tab;
        this.folder = content.folder;
        if (content.origin && content.searchContent) {
          this.origin = content.origin;
          this.searchContent = content.searchContent;
        }
        if (!options.silentUpdate) {
          this.render();
        }
        return true;
      }
      return false;
    }
    getContent() {
      return {
        tab: this.tab,
        folder: this.folder
      };
    }
    getIcon() {
      return 'ba_content_nav-personal_24';
    }
  }
  return ContentPageView;
});
//# sourceMappingURL=ContentPageView.js.map
;
/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: Cognos Analytics Home (C) Copyright IBM Corp. 2020, 2022
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define('ca-content/bridge/content/SearchContentPageView',['ca-content/content/content', '../nls/StringResources', 'react', 'react-dom'], function (content, StringResources, React, ReactDOM) {
  class SearchContentPageView {
    constructor(options) {
      this.glassContext = options.glassContext;
      this.el = options.$el && options.$el[0] || this._initDomElement();
      this.searchTerm = options.searchTerm;
      this.currentFolderId = options.currentFolderId;
      this.filterType = options.filterType;
      this.filterSearchString = options.filterSearchString;
      this.filterModified = options.filterModified;
    }
    render() {
      const options = {
        glassContext: this.glassContext,
        searchTerm: this.searchTerm,
        currentFolderId: this.currentFolderId,
        filterType: this.filterType,
        filterSearchString: this.filterSearchString,
        filterModified: this.filterModified,
        ref: _ref => this.searchPageView = _ref
      };
      ReactDOM.render(React.createElement(content.SearchContentPageView, options), this.el);
      return Promise.resolve();
    }
    activate(content) {
      this.updateContentPage(content);
      return Promise.resolve();
    }
    deactivate() {
      return Promise.resolve();
    }
    show() {
      this.el.setAttribute('style', 'display: block;');
    }
    setFocus() {}
    _initDomElement() {
      const el = document.createElement('div');
      el.classList.add('contentPageView');
      return el;
    }
    getTitle() {
      return StringResources.get('searchContentPageTitle');
    }
    updatePerspectiveContext(context) {
      const isContentUpdated = this.updateContentPage(context.content);
      this.glassContext.currentPerspective.updateRenderState(!isContentUpdated);
      if (isContentUpdated) {
        this.glassContext.updateCurrentCachedAppView();
      }
    }
    updateContentPage(content) {
      if (content.options && content.options.showCachedSearch) {
        return false;
      }
      let changed = false;
      if (this.searchTerm !== content.searchTerm || !this.searchPageView) {
        this.searchTerm = content.searchTerm;
        changed = true;
      }
      if (this.filterType !== content.filterType || !this.searchPageView) {
        this.filterType = content.filterType;
        changed = true;
      }
      if (this.filterSearchString !== content.filterSearchString || !this.searchPageView) {
        this.filterSearchString = content.filterSearchString;
        changed = true;
      }
      if (this.filterModified !== content.filterModified || !this.searchPageView) {
        this.filterModified = content.filterModified;
        changed = true;
      }
      if (this.currentFolderId !== content.currentFolderId || !this.searchPageView) {
        this.currentFolderId = content.currentFolderId;
        changed = true;
      }
      if (changed) {
        this.render();
        return true;
      } else {
        this.searchPageView.forceUpdate();
        return true;
      }
    }
    getContent() {
      return {
        searchTerm: this.searchTerm,
        filterType: this.filterType,
        filterSearchString: this.filterSearchString,
        filterModified: this.filterModified,
        currentFolderId: this.currentFolderId
      };
    }
  }
  return SearchContentPageView;
});
//# sourceMappingURL=SearchContentPageView.js.map
;
/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: Cognos Analytics Home (C) Copyright IBM Corp. 2020
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define('ca-content/bridge/content/SamplesTabView',['ca-content/content/content', 'react'], function (content, React) {
  const {
    SamplesTabView
  } = content;
  class SamplesTab {
    constructor(options) {
      this.glassContext = options.glassContext;
    }
    render(options) {
      return React.createElement(SamplesTabView, {
        glassContext: this.glassContext,
        options: options
      });
    }
  }
  return SamplesTab;
});
//# sourceMappingURL=SamplesTabView.js.map
;
/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: Cognos Analytics Home (C) Copyright IBM Corp. 2021, 2022
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define('ca-content/bridge/content/PropertiesPageView',['ca-content/content/content', '../nls/StringResources', 'react', 'react-dom', 'baglass/app/utils/CloseViewUtils'], function (content, StringResources, React, ReactDOM, CloseViewUtils) {
  class PropertiesPageView {
    constructor(options) {
      this.glassContext = options.glassContext;
      this.el = options.$el && options.$el[0] || this._initDomElement();
      this.selectionId = options.selectionId;
      this.targetId = options.targetId;
      this.selectedTab = options.selectedTab;
      this.unsavedChanges = false;
      this.anotherPerspective = false;
    }
    render() {
      const options = {
        glassContext: this.glassContext,
        selectionId: this.selectionId,
        targetId: this.targetId,
        selectedTab: this.selectedTab,
        ref: _ref => this.propertiesPageView = _ref,
        onTabChange: this.onTabChange.bind(this),
        updateDirtyState: this.updateDirtyState.bind(this),
        deactivate: this.deactivate.bind(this),
        isAnotherPerspective: this.isAnotherPerspective.bind(this)
      };
      ReactDOM.render(React.createElement(content.PropertiesPageView, options), this.el);
      return Promise.resolve();
    }
    reRender(contents) {
      const options = {
        glassContext: this.glassContext,
        selectionId: contents.selectionId,
        targetId: contents.targetId,
        selectedTab: contents.selectedTab ? this.selectedTab : 0,
        ref: _ref2 => this.propertiesPageView = _ref2,
        onTabChange: this.onTabChange.bind(this),
        updateDirtyState: this.updateDirtyState.bind(this),
        deactivate: this.deactivate.bind(this),
        isAnotherPerspective: this.isAnotherPerspective.bind(this)
      };
      ReactDOM.unmountComponentAtNode(this.el);
      ReactDOM.render(React.createElement(content.PropertiesPageView, options), this.el);
      return Promise.resolve();
    }
    activate(content) {
      this.reRender(content);
      return Promise.resolve();
    }
    onClose() {
      this.unsavedChanges = false;
      this.propertiesPageView.moduleRefs.forEach(mod => {
        const ref = mod.ref.current;
        ref && ref.onClose && ref.onClose();
      });
      this.glassContext.closeAppView('properties');
    }
    deactivate() {
      if (!this.anotherPerspective) {
        if (this.unsavedChanges === true) {
          return CloseViewUtils.waitForCloseConfirmation(this.glassContext).then(this.onClose.bind(this), () => {
            return Promise.reject();
          });
        } else {
          this.onClose();
          return Promise.resolve();
        }
      }
    }
    show() {
      this.el.setAttribute('style', 'display: block;');
    }
    setFocus() {}
    _initDomElement() {
      const el = document.createElement('div');
      el.classList.add('ca-propertiesPageViewContainer');
      el.classList.add('contentPageView');
      return el;
    }
    getTitle() {
      return StringResources.get('properties');
    }
    updateDirtyState(value) {
      this.unsavedChanges = value;
    }
    isAnotherPerspective(value) {
      this.anotherPerspective = value;
    }

    //glass methods
    onTabChange(context) {
      const isContentUpdated = this.updateContentPage(context.content);
      this.glassContext.currentPerspective.updateRenderState(!isContentUpdated);
    }
    updateContentPage(content) {
      if (this.selectedTab !== content.selectedTab || this.selectionId !== content.selectionId) {
        if (content.selectionId) {
          this.selectionId = content.selectionId;
        }
        if (content.selectedTab !== undefined) {
          this.selectedTab = content.selectedTab;
        }
        return true;
      }
      return false;
    }
    getContent() {
      return {
        selectedTab: this.selectedTab,
        selectionId: this.selectionId
      };
    }
  }
  return PropertiesPageView;
});
//# sourceMappingURL=PropertiesPageView.js.map
;

define("contentBridgeBundle", function(){});
