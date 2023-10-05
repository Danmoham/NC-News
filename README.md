# Northcoders News API

This API has been created using express JS with node to set up various end points for different types of data using PSQL to traverse the database. The link to the project which has been hosted is: https://dansnews.onrender.com/, please note if you want to do a post or patch request I would recommend using insomnia to do this. If you want to find all the possible API's please use the /API get request which will take you to a page which shows each request you can make as well as the example on there.

For anyone wishing to do this locally you will have to git clone this folder so you have all the relevant information, then you will need to set a PGDatabase to the following below "PGDATABASE=nc_news" for the full database and PGDATABASE="nc_news_test" for the test database, please ensure these are in the files .env-test and .env-development. Please also ensure that these two files are .gitignored. 

You will then have to "npm install" to install all the dependencies to run all the adequate tests. Then please use npm run setup-dbs, then proceed to seed the document by running npm run seed to make sure all the databases are seeded with the correct data.

Following this please ensure that you have a minumum of node v14,but I would recommend v18.17.1 or later as that was what as used at time of production and a psql version of 14.9 installed to be able to run this project correctly.
