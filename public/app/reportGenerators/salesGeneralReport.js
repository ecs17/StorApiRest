function genDownloadPdf(salesResult, parametersQuery, totalProducts, totalAmountSales, totalSales){
    pdfMake.createPdf(generateContentDoc(salesResult, parametersQuery, totalProducts, totalAmountSales, totalSales)).download('ReporteVents-'+ getStringDate(new Date));
}

function genOpenPdf(salesResult, parametersQuery, totalProducts, totalAmountSales, totalSales){
    pdfMake.createPdf(generateContentDoc(salesResult, parametersQuery, totalProducts, totalAmountSales, totalSales)).open();
}

function generateContentDoc(salesResult, parametersQuery, totalProducts, totalAmountSales, totalSales){
  var hasParameters = false;
  var docDefinition = {}; 
  docDefinition = generateHead(parametersQuery);
  generateTable(salesResult, docDefinition, totalProducts, totalAmountSales, totalSales);
  return docDefinition;
}

function generateHead(parametersQuery){
    var docDefinition = {
      content: [
        { 
          text: 'Reporte de ventas Abarrotes el Chino\n\n', 
          style: 'header',
          alignment: 'center'
        }
      ],
      styles: {
        header: {
          fontSize: 25,
          bold: true
        },
        tableMargins: {
			margin: [0, 5, 0, 15]
		},
        tableMarginsIntern: {
			margin: [0, -1, 0, 25]
		}
      }
    };
  if (parametersQuery.startDate != null) {
    hasParameters = true;
    if (parametersQuery.endDate != null) {
      docDefinition.content.push({
        text: [
          {
            text: 'Periodo de ventas: ', bold: true 
          },
          getStringDate(parametersQuery.startDate) + ' al ' + getStringDate(parametersQuery.endDate) + '\n'
        ]
      });
    } else {
      docDefinition.content.push({
        text: [
          {text: 'Fecha de ventas: ', bold: true },
          getStringDate(parametersQuery.startDate) + '\n'
        ]
      });
    }
  }
  if (parametersQuery.clients.length > 0) {
    docDefinition.content.push({
      text: [
        {text: 'Ventas a los clientes: ', bold: true},
        getClientUserProductInQuery(parametersQuery.clients) + '\n'
      ]
    })
  }
  if (parametersQuery.users.length > 0) {
    docDefinition.content.push({
      text: [
        {text: 'Ventas por Usuarios: ', bold: true},
        getClientUserProductInQuery(parametersQuery.users) + '\n'
      ]
    });
  }
  if (parametersQuery.products.length > 0) {
    docDefinition.content.push({
      text: [
        {text: 'Ventas por Productos: ', bold: true},
        getClientUserProductInQuery(parametersQuery.products) + '\n'
      ]
    });
  }
  if (parametersQuery.cash || parametersQuery.credit) {
    docDefinition.content.push({
      text: [
        {text: 'Ventas a: ', bold: true},
        (parametersQuery.cash ? 'Contado' : 'Credito') + '\n'
      ]
    });
  }
  return docDefinition;
}

function generateTable(salesResult, docDefinition, totalProducts, totalAmountSales, totalSales){
    docDefinition.content.push({
        text: [
             {text: '\nTotal de Ventas: ', fontSize: 14, bold: true, alignment: 'right', margin: [0, 20, 0, 8]},
             totalSales.toString() + '\n',
             {text: 'Total de Productos en ventas: ', fontSize: 14, bold: true, alignment: 'right', margin: [0, 20, 0, 8]},
             totalProducts.toString() + '\n',
             {text: 'Monto Total de ventas($): ', fontSize: 14, bold: true, alignment: 'right', margin: [0, 20, 0, 8]},
             totalAmountSales.toFixed(2).toString() + '\n'
        ]
    });

    docDefinition.content.push({
        text: '\n\n Listado de Ventas:', fontSize: 14, bold: true, margin: [0, 20, 0, 8]
    });
    var bodyArray = [[{ text: 'No. Venta', style: 'tableHeader' }, { text: 'Fecha de venta', style: 'tableHeader'}, { text: 'Num.\nProductos', style: 'tableHeader' }, { text: 'Total de venta', style: 'tableHeader' }]];
    _.each(salesResult, function(singleSale, index){
        bodyArray.push(
            [
                (index + 1).toString(),
                singleSale.dateSaleFormat,
                {text: singleSale.totalProducts.toString(), alignment: 'center'},
                singleSale.totalAmount.toFixed(2)
            ]
        );
        bodyArray.push(
            [
                {text: 'Detalle de la venta', style: 'tableHeader', colSpan: 4, alignment: 'center'},{},{},{}
            ]
        );
        var subBodyArray = [[{ text: 'Cod.Barras', style: 'tableHeader' }, { text: 'Nombre del Productp', style: 'tableHeader'}, { text: 'Cantidad', style: 'tableHeader' }, { text: 'Precio Unitario', style: 'tableHeader' }]]
        _.each(singleSale.detailSale, function(prodInSale, index){
            subBodyArray.push(
                [
                    prodInSale.bar_code,
                    prodInSale.detailProduct.name_prod,
                    prodInSale.quantity.toString(),
                    prodInSale.detailProduct.price.sale_price.toFixed(2)
                ]
            )
        });
        bodyArray.push(
            [
                {
                    style: 'tableMarginsIntern',
                    table: {
                        headerRows: 1,
                        widths: [100, 200, '*', 70],
                        body: subBodyArray
                    }, colSpan: 4
                },{},{},{}
            ]
        );
    });
    docDefinition.content.push({
        style: 'tableMargins',
        table: {
            widths: [100, 200, '*', 70],
            body: bodyArray
        },
        layout: 'lightHorizontalLines'
    });
    console.log(docDefinition);
}

function getStringDate(date){
  var monthNames = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"];
  var dateString = '';
  dateString = dateString + date.getDate() + '-' + monthNames[date.getMonth()] + '-' + date.getFullYear();
  return dateString
}

function getClientUserProductInQuery(cup){
  var cupString = '';
  _.each(cup, function(clientUser, index){
    if(index > 0)
      cupString = cupString + ', ';

    cupString = cupString + clientUser.name;
  });
  return cupString;
}