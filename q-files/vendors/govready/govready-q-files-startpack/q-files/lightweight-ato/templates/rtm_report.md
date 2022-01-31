id: rtm_report.md
format: markdown
title: RTM Report
...

<style type="text/css" scoped>
    h2 { border-bottom:1px solid #888; margin-top: 3em; color: red;}
    h3 { border-bottom: 0.5px solid #aaa; color: #777; font-size: 14pt; font-weight: bold;}
    h4 { margin-top: 15px; font-weight: bold; font-size: 1em; }
    blockquote { color: #666; font-size:0.8em; margin: 0 10px; }
    .notice {color: red; font-size:3.0em; text-align:center; transform: scaleY(.85);
    font-weight: bold;}
    table { border: none; border-collapse: collapse; }
    th, td { border: 1px solid #888; padding: 15px; text-align: left;}
    @media all {
        .page-break     { display: none; }
    }
    .table-caption {
      color: red;
      text-align: center;
      font-style: italic;
      margin: 1em; 0 0.33em; 0;
    }
    table.table-ssp {
      margin-bottom: 1.0em;
      width: 100%;
    }
    table.table-ssp th, table.table-ssp td {
      padding: 4px;
    }
    td.td-header, th.th-header {
      color: white;
      background-color: rgb(31, 58, 105);
      text-align:center;
      font-weight: bold;
    }
    td.td-c-name-part, td.td-row-title {
      width: 125px;
      background-color: rgb(219, 228, 244);
      font-weight: bold;
      padding-left: 12px;
    }
    table.table-ssp td {
      padding-left: 12px;
    }
    .soft {
      color: #aaa;
    }
    @media print {
        h1.title {
            /* v-center, need absolute */
            position: absolute; /* repeats once */
            bottom: 50%;
            /* h-center, for element with absolute positioning */
            left: 0;
            right: 0;
            margin-left: 20%;
            margin-right: 20%;
        }
        .footer {
            position: fixed; /* repeats on every page */
            bottom: 0;
        }
        table.footer {
            width: 95%;
            display: table;
        }
        table.footer td {
            border: none;
            padding: 0px;
            padding-bottom: .1em;
        }
        .page-break { display: block; page-break-after: always; }
    }
</style>

<center>
<h1 class="title">{{project.system_info.system_name}}<br/>Requirements Traceability Matrix<br/>(RTM) Report</h1>
<img style="max-width:70%;height:auto;" src="{{static_asset_path_for('app.png')}}">
<br></br>
<h1>Prepared for</br/>{{project.system_info.system_org}}</h1>
<br></br>
{{project.rtm_doc.rtm_date}}
</center>




* * *

## Table of Contents

*   [1. RTM](#rtm)
    *   [1.1 Introduction](#introduction)
    *   [1.2 Plan of Action and Milestone Table](#rtmtable)

* * *

## 1. RTM
### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.1 Introduction
The Requirements Traceability Matrix (RTM) relates requirements from requirement source documents to the security certification process. It ensures that all security requirements are identified and investigated. Each row of the matrix identifies a specific requirement and provides the details of how it was tested or analyzed and the results.

The table is arranged to display the system security requirements from the applicable regulation documents, which are listed below:

* NIST 800-53 w/ DHS 4300A - Department of Homeland Security Sensitive Systems Policy Directive 4300A Version 10

The descriptions of the RTM are defined as follows:

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg">
  <tr>
    <th class="tg-0pky">RTM Column</th>
    <th class="tg-0pky">Column Description</th>
  </tr>
  <tr>
    <td class="tg-0pky">Control Ref.</td>
    <td class="tg-0pky">Refers to the name (short title) of the source document and the ID or paragraph number of the listed control or requirement.</td>
  </tr>
  <tr>
    <td class="tg-0pky">Security Req./Control</td>
    <td class="tg-0pky">Short title describing the security control or requirement (and the text of the control/requirement, which may be paraphrased for brevity).</td>
  </tr>
  <tr>
    <td class="tg-0pky">Security Category</td>
    <td class="tg-0pky">Category and class associated with the security control.</td>
  </tr>
  <tr>
    <td class="tg-0pky">Control Type</td>
    <td class="tg-0pky">Auto populated if the requirement is identified with two security control types: common and system-specific; i.e., a part of the requirement is identified as common type and another part of it is system-specific.<br><br><li>Common. Auto populated if the requirement is designated to one or more information systems.</li><li>Hybrid. Auto populated if the requirement is identified with two security control types: common and system-specific; i.e., a part of the requirement is identified as common type and another part of it is system-specific.</li><li>System-Specific. Auto populated if the requirement is assigned to a specific information system.</li><li>Inherited. Auto populated if the requirement is inherited from another system.</li><li>Not Specified. Auto populated if the requirement does not require any security control.</li></td>
  </tr>
  <tr>
    <td class="tg-0pky">Planned Imp.</td>
    <td class="tg-0pky">Auto populated if the requirement is identified with two security control types: common and system-specific; i.e., a part of the requirement is identified as common type and another part of it is system-specific.<br><br><li>Common. Auto populated if the requirement is designated to one or more information systems.</li><li>Hybrid. Auto populated if the requirement is identified with two security control types: common and system-specific; i.e., a part of the requirement is identified as common type and another part of it is system-specific.</li><li>System-Specific. Auto populated if the requirement is assigned to a specific information system.</li><li>Inherited. Auto populated if the requirement is inherited from another system.</li><li>Not Specified. Auto populated if the requirement does not require any security control.</li></td>
  </tr>
  <tr>
    <td class="tg-0pky">Actual Imp.</td>
    <td class="tg-0pky">Identification whether the control is in place and how it has been implemented, or differences in how the control was implemented compared to what was planned.<br><br><li>As Planned. Auto populated if Implemented control status is selected and Planned Implementation column does not read Not Entered.</li><li>Pending Implementation. Auto populated if Planned control status is selected and Planned Implementation column does not read Not Entered.</li><li>Partially Implemented. Auto populated if Partial control status is selected and Planned Implementation column does not read Not Entered.</li><li>Not Entered. Auto populated if the Planned Implementation column reads Not Entered.</li><li>Not Assigned. Auto populated if the Control Type and/or Control Status were not selected.</li></td>
  </tr>
  <tr>
    <td class="tg-0pky">Test #(s)</td>
    <td class="tg-0pky">The ID number of the specific test procedure(s) that is used to validate the requirement or control.<br>The control is not applicable.</td>
  </tr>
  <tr>
    <td class="tg-0pky">Methods</td>
    <td class="tg-0pky">The evaluation method (or methods) used to assess the requirement.<li>I. Interview.</li><li>E. Examine.</li><li>T. Testing.</li><li>The control is not applicable.</li></td>
  </tr>
  <tr>
    <td class="tg-0pky">Tailored</td>
    <td class="tg-0pky">The tailored control that modifies the control set.<li>In. The control was tailored in.</li><li>Out. The control was tailored out.</li><br>The control was not affected from tailoring.</td>
  </tr>
  <tr>
    <td class="tg-0pky">Overlays</td>
    <td class="tg-0pky">The controls included or excluded from the controls already in the baseline.<li>In. The control was added in to the controls in the baseline.</li><li>Out. The control was removed from the controls in the baseline.</li><br>The control was not affected from overlay(s).</td>
  </tr>
  <tr>
    <td class="tg-0pky">Result</td>
    <td class="tg-0pky">The summarized result for the test procedures that cover the requirement/control.<li>Met - Requirement fully satisfied.</li><li>Not Met - Requirement not satisfied.</li><li>Not Applicable - Requirement not applicable.</li></td>
  </tr>
  <tr>
    <td class="tg-0pky">Notes</td>
    <td class="tg-0pky">Identifies the factor, and the basis for; any tailoring of controls from the NIST 800-53 w/ DHS 4300A baseline or organizational overlay that was used for the system.</td>
  </tr>
</table>



<br></br>

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.2 Requirement Traceability Matrix Table

{% if control_catalog|length > system.root_element.selected_controls_oscal_ctl_ids|length %}

{% set meta = {"current_family_title": "", "current_control": "", "current_control_part": "", "control_count": 0, "current_parts": ""} %}

{% for control in system.root_element.selected_controls_oscal_ctl_ids %}

{% if meta['current_family_title'] != control_catalog[control.lower()]['family_title'] %}
  {# When current current control family changes print the new control family and update the current control family #}
  <h2>{{control_catalog[control.lower()]['family_id']|upper}} - {{control_catalog[control.lower()]['family_title']}}</h2>
  {% set var_ignore = meta.update({"current_family_title": control_catalog[control.lower()]['family_title']}) %}
  {% if meta['current_control'] != control.lower() %}
  {% set var_ignore = meta.update({"current_control": control.lower()}) %}
  <table>
    <tr>
      <td>{{control}} What is the solution and how is it implemented?
        {{control|upper}} - {{control_catalog[control.lower()]['title']}}
      </td>
    </tr>
    <tr>
      <td>
        {% if control in system.control_implementation_as_dict %}
            <div style="white-space: pre-line; word-break: keep-all;">{{ system.control_implementation_as_dict[control]['combined_smt']|safe }}</div>
          {% else %}
            <div style="white-space: pre-line; word-break: keep-all;">No statement available.</div>
          {% endif %}
      </td>
    </tr>
  </table>
  {% endif %}
  {% endif %}

{% endfor %}<!-- /for ctl in -->

{% endif %}





