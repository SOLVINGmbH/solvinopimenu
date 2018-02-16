import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';

import * as strings from 'SolvinOpiMenuApplicationCustomizerStrings';

const LOG_SOURCE: string = 'SolvinOpiMenuApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISolvinOpiMenuApplicationCustomizerProperties {

}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SolvinOpiMenuApplicationCustomizer
  extends BaseApplicationCustomizer<ISolvinOpiMenuApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve();
  }
  private _renderPlaceHolders(): void {

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });


      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
          
              <div class="placeholdertop" translate="no">
                  <div id="menucontainer">
                  <!--Menu-->
                  <div id="topmenulevel1"></div>
              </div>	
                  <div id="topmenulevel2"></div>
              </div>`;
      }

      SPComponentLoader.loadScript('/_layouts/15/init.js', {
        globalExportsName: '$_global_init'
      })
        .then((): Promise<{}> => {
          return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', {
            globalExportsName: 'Sys'
          });
        })
        .then((): Promise<{}> => {
          return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', {
            globalExportsName: 'SP'
          });
        })
        .then((): Promise<{}> => {
          return SPComponentLoader.loadScript('/_layouts/15/SP.js', {
            globalExportsName: 'SP'
          });
        })
        .then((): Promise<{}> => {
          return SPComponentLoader.loadScript('/_layouts/15/SP.Taxonomy.js', {
            globalExportsName: 'SP'
          });
        })

        .then((): void => {

          //var lcid = _spPageContextInfo.currentLanguage;
          var lcid = 1033;
          var count = 1;
          var tmpstring = "";
          var tmpstring2 = "";

          var weburl = this.context.pageContext.web.absoluteUrl;
          var siteurl = this.context.pageContext.site.absoluteUrl;
          var siteserverRelativeUrl = this.context.pageContext.site.serverRelativeUrl;
          var webserverRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
          var webtitle = this.context.pageContext.web.title;

          var context = new SP.ClientContext(weburl);
          var rootweb = context.get_site().get_rootWeb();
          var web = context.get_web();
          var parentweb = web.get_parentWeb();
          //var parentweb = context.get_site().openWebById(parentInfo.get_id());

          //access term store
          var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
          var termStore = session.getDefaultSiteCollectionTermStore();
          //TermSetID
          var guid = new SP.Guid("25777d84-8902-4bed-8629-7c1aabffbbfd");
          var termSet = termStore.getTermSet(guid);
          var terms = termSet.getAllTerms();
          var results;
          context.load(rootweb);

          context.load(parentweb);
          context.load(terms, 'Include(IsRoot, Labels, TermsCount, CustomSortOrder, Id, Name, PathOfTerm, Parent, Parent.Id, LocalCustomProperties, CustomProperties)');
          context.executeQueryAsync(function () {
            var termEnumerator = terms.getEnumerator();
            while (termEnumerator.moveNext()) {
              var currentTerm = termEnumerator.get_current();
              if (currentTerm.get_isRoot()) {
                topmenuterms.push({
                  name: currentTerm.get_name(),
                  id: currentTerm.get_id().toString(),
                  sort: currentTerm.get_customSortOrder() == null ? "" : currentTerm.get_customSortOrder(),
                  defaultlabel: currentTerm.getDefaultLabel(lcid),
                  link: currentTerm.get_localCustomProperties()._Sys_Nav_SimpleLinkUrl,
                  hasPermission: 1
                });
                topanzahl++;
              }
              else {
                var term_parent = currentTerm.get_parent();
                var parent_id = term_parent.get_id();
                level2terms.push({
                  name: currentTerm.get_name(),
                  id: currentTerm.get_id().toString(),
                  parentid: parent_id.toString(),
                  sort: currentTerm.get_customSortOrder() == null ? "" : currentTerm.get_customSortOrder(),
                  link: currentTerm.get_localCustomProperties()._Sys_Nav_SimpleLinkUrl,
                  defaultlabel: currentTerm.getDefaultLabel(lcid),
                  newcolumn: currentTerm.get_customProperties()["newcolumn"] === undefined ? "no" : currentTerm.get_customProperties()["newcolumn"].toString(),
                  hasPermission: 1
                });
              }
              count += 1;
            }


            count = 1;
            var menucount = 0;
            var arrayLength = topmenuterms.length;
            for (var i = 0; i < arrayLength; i++) {
              var showtopmenu = true;
              tmpstring += "<div class=\"topmenu";
              var currentweb = weburl.toLowerCase();
              if (typeof topmenuterms[i].link != 'undefined') {
                var topmenulink = topmenuterms[i].link.toLowerCase().replace(":443", "");
                if (topmenulink.endsWith("/"))
                  topmenulink = topmenulink.substring(0, topmenulink.length - 1);

                if (topmenulink.indexOf(currentweb) >= 0 && menucount < 1) {
                  tmpstring += " topmenuselectedweb";
                  menucount++;
                }
              }
              tmpstring += "\"";
              //tmpstring+="<div class=\"topmenu\" id=\"top"+count+"\" onclick=\"togglemenu('top"+count+"')\">" + topmenuterms[i].name + "</div>";			            
              if (typeof topmenuterms[i].link == 'undefined')
                tmpstring += " id=\"top" + count + "\" onmouseover=\"showmenu('" + count + "')\" onmouseleave=\"hidemenu('" + count + "')\" >" + topmenuterms[i].name + "</div>";
              else {
                tmpstring += " id=\"top" + count + "\" onmouseover=\"showmenu('" + count + "')\" onmouseleave=\"hidemenu('" + count + "')\" onclick=\"window.location='" + topmenuterms[i].link + "'\" >" + topmenuterms[i].name + "</div>";

              }
              if (showtopmenu) {
                //filter 2. Array nach parentid
                var level2termsfiltered = level2terms.filter(function (el) {
                  return el.parentid == topmenuterms[i].id;
                });
                var sortOrder;
                if (topmenuterms[i].sort != "") {
                  sortOrder = topmenuterms[i].sort.split(':');
                  level2termsfiltered.sort(function (a, b) {
                    var indexA = sortOrder.indexOf(a.id);
                    var indexB = sortOrder.indexOf(b.id);

                    if (indexA > indexB) {
                      return 1;
                    } else if (indexA < indexB) {
                      return -1;
                    }
                    return 0;
                  });
                }


                var level2length = level2termsfiltered.length;
                if (level2length > 0) {
                  tmpstring2 += "<div class=\"submenu\" id=\"top" + (i + 1) + "menu\" style=\"display:none\" onmouseover=\"showmenu('" + count + "')\" onmouseleave=\"hidemenu('" + count + "')\" >";
                  tmpstring2 += "<div style=\"float:left\">";
                  for (var j = 0; j < level2length; j++) {
                    var link = level2termsfiltered[j].link;

                    if (level2termsfiltered[j].newcolumn == "yes") {
                      tmpstring2 += "</div><div style=\"float:left\">";
                    }
                    tmpstring2 += "<div class=\"submenusection\" >";

                    var showsubmenu = true;
                    //Überschrift
                    if (link === undefined) {
                      //nur Text, kein Link
                      tmpstring2 += "<div class=\"submenusectionheading\" >" + level2termsfiltered[j].name + "</div>";

                    }
                    else {
                      tmpstring2 += "<div class=\"submenusectionheading\" >" + "<a href='" + link + " ' class=\"submenusectionheadinga\">" + level2termsfiltered[j].name + "</a></div>";

                    }

                    if (showsubmenu) {
                      var level3termsfiltered = level2terms.filter(function (el) {
                        return el.parentid == level2termsfiltered[j].id;
                      });
                      var level3length = level3termsfiltered.length;
                      if (level3length > 0) {
                        if (level2termsfiltered[j].sort != "") {
                          sortOrder = level2termsfiltered[j].sort.split(':');
                          level3termsfiltered.sort(function (a, b) {
                            var indexA = sortOrder.indexOf(a.id);
                            var indexB = sortOrder.indexOf(b.id);
                            if (indexA > indexB) {
                              return 1;
                            } else if (indexA < indexB) {
                              return -1;
                            }
                            return 0;
                          });
                        }
                        tmpstring2 += "<div class=\"submenusectionbody\" id=\"submenusectionbody_" + i + "_" + j + "\" >";
                        for (var k = 0; k < level3length; k++) {
                          //Link
                          var link = level3termsfiltered[k].link;
                          if (link === undefined) {
                            //nur Text, kein Link
                            tmpstring2 += level3termsfiltered[k].name + "<br/>";
                          }
                          else {
                            if (level3termsfiltered[k] !== undefined) {
                              tmpstring2 += "<a href='" + link + "'>" + level3termsfiltered[k].name + "</a><br/>";
                            }
                          }
                        }
                        tmpstring2 += "</div>";
                      }
                    }

                    tmpstring2 += "</div>";

                  }
                  tmpstring2 += "</div>";
                  tmpstring2 += "</div>";

                }
                else {
                  tmpstring2 += "<div id=\"top" + (i + 1) + "menu\" style=\"display:none\" />";

                }
              }
              count += 1;
            }
            document.getElementById("topmenulevel1").innerHTML = tmpstring;
            document.getElementById("topmenulevel2").innerHTML = tmpstring2;
            window.localStorage.setItem("topmenulevel1", tmpstring);
            window.localStorage.setItem("topmenulevel2", tmpstring2);

            require('./MegaMenu.js');
            require('./MegaMenu.css');
            require('jquery');

          }, function (sender, args) {
            console.log(args.get_message());
          });
        })
        .catch((reason: any) => {
          document.getElementById("topmenulevel1").innerHTML = window.localStorage.getItem("topmenulevel1");
          document.getElementById("topmenulevel2").innerHTML = window.localStorage.getItem("topmenulevel2");
          require('./MegaMenu.js');
          require('./MegaMenu.css');
          require('jquery');
         
        });
    }
  }
  private _onDispose(): void {
    console.log('[ApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
var topanzahl = 0;
var currentUser;
var arrayshtml;
var useAnimation = true; // Animation is supported in IE9+
var collapseOtherLevels = false; // Collapse sibling levels on expanding
var expandTransition = 'height 0.15s ease-out';
var collapseTransition = 'height 0.15s ease-out';

var breadcrumbtextfull = "";
var maxlevels = 3;
var trennzeichen = "<span class='s4-breadcrumb-arrowcont'><span class='s4-clust s4-breadcrumb' style='width: 13px; height: 10px; overflow: hidden; display: inline-block; position: relative;'><img style='left: 0px !important; top: -573px !important; position: absolute;' alt='' src='/_layouts/15/images/fgimg.png?rev=23'></span></span>";
var trennzeichenklein = "<span class='s4-breadcrumb-arrowcont'><span class='s4-clust s4-breadcrumb' style='width: 13px; height: 8px; overflow: hidden; display: inline-block; position: relative;'><img style='left: 0px !important; top: -573px !important; position: absolute;' alt='' src='/_layouts/15/images/fgimg.png?rev=23'></span></span>";
var topmenuterms = [];
var level2terms = [];
var keywordqueries = [];
var keywordqueryids = [];

var securitytrimming = false;
var querylen = 2000;
