import React, { Component } from 'react'
// import ReactDOM from 'react-dom';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
// import styled from '@react-pdf/styled-components';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
    </Page>
  </Document>
);
class PDFCV extends Component {
  render() {
    return (
      <PDFViewer>
      <MyDocument />
    </PDFViewer>
    );
  }
}

export default PDFCV;