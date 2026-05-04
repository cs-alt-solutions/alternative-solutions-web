export const getCalculatedStock = (item: any) => {
  const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
  return hasVariants ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : (item.onHand || 0);
};

export const handlePrintManifest = (auditData: any[], clientConfig: any, reportType: string, filtersApplied: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const dateStr = new Date().toLocaleString();
  let reportTitle = "Complete Master Inventory";
  if (reportType === 'LOW_STOCK') reportTitle = "Low Stock Warning Report";
  if (reportType === 'OOS') reportTitle = "Out of Stock (Zero Count) Report";
  if (reportType === 'MISSING_ASSETS') reportTitle = "Missing Assets & Photography Report";
  if (reportType === 'PROMO') reportTitle = "Active Promotions & Deals Report";

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Warehouse Audit - ${dateStr}</title>
      <style>
        body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #111; max-width: 1000px; margin: 0 auto; }
        .header { border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
        .header p { margin: 4px 0; font-size: 12px; color: #555; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; vertical-align: middle; }
        th { background: #f4f4f5; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .qty-box { width: 60px; height: 24px; border: 1px dashed #999; display: inline-block; background: #fff; }
        .promo-tag { background: #fee2e2; color: #e11d48; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .variant-row td { background-color: #fafafa; border-top: 1px dashed #e5e5e5; color: #555; }
        .variant-label { padding-left: 20px; font-weight: bold; font-size: 10px; }
        .master-row-muted td { background-color: #fcfcfc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${clientConfig.name || 'Division'} - Warehouse Manifest</h1>
        <p><strong>Report Type:</strong> ${reportTitle}</p>
        ${filtersApplied ? `<p><strong>Filters:</strong> ${filtersApplied}</p>` : ''}
        <p><strong>Generated:</strong> ${dateStr} | <strong>Master Records:</strong> ${auditData.length}</p>
        <p><strong>Auditor Sign-off:</strong> ___________________________</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Information</th>
            <th>Taxonomy</th>
            <th style="text-align: center;">System Count</th>
            <th style="text-align: center;">Physical Count</th>
          </tr>
        </thead>
        <tbody>
  `;

  auditData.forEach(item => {
    const stockCount = getCalculatedStock(item);
    const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
    const promoTag = item.dailyDeal ? `<span class="promo-tag">Promo Active</span>` : '';

    if (hasVariants) {
      html += `
        <tr class="master-row-muted">
          <td style="font-family: monospace; font-size: 9px;">${item.id}</td>
          <td>
            <strong style="font-size: 13px; color: #111;">${item.name}</strong>
            ${item.brand ? `<br/><span style="font-size:10px; color: #111;">By ${item.brand}</span>` : ''}
            ${promoTag ? `<br/>${promoTag}` : ''}
          </td>
          <td>
            <strong style="color: #111;">${item.mainCategory}</strong><br/>
            <span style="color:#666;">↳ ${item.subCategory || 'General'}</span>
          </td>
          <td style="font-size: 14px; font-weight: bold; text-align: center; color: #111;">${stockCount} <span style="font-size:9px; font-weight:normal; color:#666;">(Total)</span></td>
          <td style="background: #e5e5e5; text-align: center;"><span style="font-size: 9px; color: #888;">See Variants Down</span></td>
        </tr>
      `;
      item.options.forEach((opt: any) => {
        html += `
          <tr class="variant-row">
            <td></td>
            <td colspan="2" class="variant-label">↳ ${opt.label}</td>
            <td style="text-align: center; font-size: 12px; font-weight: bold;">${opt.stock || 0}</td>
            <td style="text-align: center;"><div class="qty-box"></div></td>
          </tr>
        `;
      });
    } else {
      html += `
        <tr>
          <td style="font-family: monospace; font-size: 9px;">${item.id}</td>
          <td>
            <strong style="font-size: 13px;">${item.name}</strong>
            ${item.brand ? `<br/><span style="font-size:10px;">By ${item.brand}</span>` : ''}
            ${promoTag ? `<br/>${promoTag}` : ''}
          </td>
          <td>
            <strong>${item.mainCategory}</strong><br/>
            <span style="color:#666;">↳ ${item.subCategory || 'General'}</span>
          </td>
          <td style="font-size: 16px; font-weight: bold; text-align: center;">${stockCount}</td>
          <td style="text-align: center;"><div class="qty-box"></div></td>
        </tr>
      `;
    }
  });

  html += `
        </tbody>
      </table>
      <div style="margin-top: 40px; font-size: 10px; text-align: center; color: #888;">END OF MANIFEST</div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
};

export const handleExportCSV = (auditData: any[]) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Product Name,Variant Name,Brand,Category,Subcategory,Promo Status,Has Image,System Stock\n";
  
  auditData.forEach(item => {
    const hasImg = (item.imageUrl || item.iconUrl) ? 'Yes' : 'No';
    const isPromo = item.dailyDeal ? 'Yes' : 'No';
    const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';

    if (hasVariants) {
      item.options.forEach((opt: any) => {
        const row = [
          item.id,
          `"${item.name?.replace(/"/g, '""') || ''}"`,
          `"${opt.label?.replace(/"/g, '""') || ''}"`,
          `"${item.brand?.replace(/"/g, '""') || ''}"`,
          `"${item.mainCategory || ''}"`,
          `"${item.subCategory || ''}"`,
          isPromo,
          hasImg,
          opt.stock || 0
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      const stockCount = getCalculatedStock(item);
      const row = [
        item.id,
        `"${item.name?.replace(/"/g, '""') || ''}"`,
        `"Standard Unit"`,
        `"${item.brand?.replace(/"/g, '""') || ''}"`,
        `"${item.mainCategory || ''}"`,
        `"${item.subCategory || ''}"`,
        isPromo,
        hasImg,
        stockCount
      ].join(",");
      csvContent += row + "\n";
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `warehouse_audit_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};