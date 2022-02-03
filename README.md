# Manga2PDF
An application designed to fetch manga to convert them into a more portable format.

## Demo
**Accessible at**: [Demo Amplify App](https://master.d2oxo9qqretwhm.amplifyapp.com/)
#### Steps to use
1. Search for a series
   - Enter in a manga series to convert to PDF
2. Specify the chapters  to be converted
   - Enter in minimum/first and maximum/last chapters
     - Single chapter selection to be added
3. Conversion and downloading
   - After entering in the chapters to convert, click on 'Convert' to initiate a conversion request
     - Once conversion has been completed, a 'Download' button will appear to download the PDF

## FAQ
Q. Where can I find a list of manga accessible on this platform?  
A. This application pulls from the series available on [Manganato.](https://manganato.com/) Ideal representation of the application would include: Naruto, Oyasumi Punpun, and Maou-jou de Oyasumi.

Q. Can I make a request to download a complete series?  
A. Current, large conversion requests are unable to be made. Any requests larger than 5 chapters will not be made.

## Technologies in use
* HTML5/CSS3/JavaScript
  * Bootstrap
  * React 
* Python
* AWS
  * Amplify
  * Application Load Balancer
  * Lambda
  * S3 