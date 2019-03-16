---
title: Machine Learning with SciKit Learn
subTitle: An Introduction in building machine learning applications with the SciKit Python library. Learn data preprocessing and implement supervised and unsupervised algorithms as well as performing error analysis to evaluate their performance.
category: "Python"
date: 2018-01-02
cover: photo-33796028333_a7fa30ab08_o-cover.jpg
hero: photo-33796028333_a7fa30ab08_o.jpg
---


![Shenzhen, China](./photo-33796028333_a7fa30ab08_o.jpg)


<!-- TOC depthFrom:2 depthTo:4 -->

- [Prerequisite](#prerequisite)

<!-- /TOC -->


An Introduction in building machine learning applications with the SciKit Python library. Learn data preprocessing and implement supervised and unsupervised algorithms as well as performing error analysis to evaluate their performance.


## Prerequisite

First we need to install the [Anaconda Environment](https://www.anaconda.com/download/) for Windows, macOS or LINUX. This package combines everything we need to get started with Python. From libraries like [SciKit-Learn](https://scikit-learn.org/stable/), Pandas and Matplotlib to Jupyter Notebook, that will help us to execute our Python scripts.

We will begin working with the [Seaborn Package](https://anaconda.org/anaconda/seaborn) dataset that is included in the Anaconda package to become familiar with Python based data analysis.

In the later steps, we are going to use publicly available data from the [UCI Archive](https://archive.ics.uci.edu):

* [Adult Fertility Study](https://archive.ics.uci.edu/ml/datasets/Fertility)
  * https://archive.ics.uci.edu/ml/machine-learning-databases/00244/
  * https://archive.ics.uci.edu/ml/machine-learning-databases/adult/

* [Bank+Marketing Study](https://archive.ics.uci.edu/ml/datasets/Bank+Marketing)
  * https://archive.ics.uci.edu/ml/machine-learning-databases/00222/



## SciKit Introduction

[SciKit-Learn](https://scikit-learn.org/) is a OpenSource library for building models based on built-in machine learning and statistical algorithms. The library offers both supervised and unsupervised models, that we will use to analyze our data with.

The library is used to:

* Interpret data and train models
* Perform predictions from data sets
* Cross validation and performance metric analysis
* To create sample data sets and test algorithms


### Data Representation

To feed data into SciKit it needs to be represented as a table or matrix. Most data used in machine learning is 2-dimensional - that means it can be represented by a classical Excel sheet with rows and columns:

* Rows represent observations (instances)
* Columns represent characteristics (features)

Datasets often have many features that will be represented in the __Feature Matrix__. In most cases it will only be one or two features that will separated for the later analysis of the data set - this skimmed down dataset is called the __Target Matrix__:


__Feature Matrix__

* Contains data from each instance for all features
* The dimensions of the matrix are `[n_i, n_f]` denoting the number of instances and features.


__Target Matrix__

* Is usually 1-dimensional as it only contains 1 feature for all instances. If more than 1 feature is necessary to describe the model the dimension increases accordingly.


The Feature Matrix is usually stored in the variable __X__, while the variable __Y__ is used to store the __Target Matrix__. Both matrices can be created by using a __NumPy Array__ or a __Panda DataFrame__. 


In the following example we are going to look at plant statistic from the [Seaborn Package](https://anaconda.org/anaconda/seaborn) included in the [Anaconda Environment](https://www.anaconda.com/download/). Each row in the set will represent a species of the Setosa family and columns represent the plant characteristics of the sepal as well as petal length and width:


![Python SciKit-Learn](./python-ml_01.png)


1. We import the __Seaborn__ package into the variable __sns__.
2. We can now extract the __Iris Dataset__ from it and store the data inside the variable __iris__.
3. We then drop the __Species Feature__ from the dataset and store it inside the variable __X__. Thus the __Feature Matrix__ consists of all the features __BUT__ the target for all instances. Making it a 2 dimensional dataset.
4. Now we can have a look at the top 10 rows of our data to get an idea what it looks like.
5. The __Shape__ command shows us that we have a __Feature Matrix__ that consists of _150 rows_ (instances) and _4 columns_ (features).
6. We will now build the __Target Matrix__ based on the __Species Feature__ and store it in the variable __Y__.
7. And we see that the first 10 species all belong to the Setosa family. The __Target Matrix__ is now reduced from the earlier 2 to 1 dimension - only consisting of the target feature for all instances.


### Data Preprocessing

IRL datasets are usually not analysis-friendly (__messy data__), as they are containing _noisy data_, _missing entries_ and _outliers_ that need to be dealt with before feeding them to our algorithm.


__Dealing with Missing Values__:


* Eliminate Data
* Or Replace it
  * __Mean Imputation__ - filling out missing fields using the mean or median value (_may introduce bias to our model_)
  * __Regression Imputation__ - Use prediction to fill out the values (_may end up overfitting the model_)
* String-based values should be replaced with a class (_like  "uncategorized"_) 


__Dealing with Outliers__:

Outliers represent values that are far from the mean (often set to __3-6 standard deviations__ when the data set follows a Gaussian distribution). If the values follow a Gaussian distribution, _global outliers_ are located at the tails of the bell curve. While _local outliers_ are inside the distribution but far off the group of data points they are associated with. E.g. a vehicle that can drive 500 MPH is a global outlier in a car statistic. While a truck that only has 40 hp is a local outlier in the group labeled as trucks, but is still well inside the curve of the vehicle dataset.


* Delete Outliers.
* If all instances above a certain value of a feature behave the same way, you can __define a top__ for that feature and apply it to outliers.
* Replace the value (__Mean__ or __Regression__).
* String values (e.g. misspelled features) can be eliminated or corrected (when possible).



In the following example we will again use the [Seaborn Package](https://anaconda.org/anaconda/seaborn) included in the [Anaconda Environment](https://www.anaconda.com/download/) and take a look at the age of the passengers of the __Titantic__:




![Python SciKit-Learn](./python-ml_02.png)


1. We import the __Seaborn__ package and store the __Titanic Dataset__ inside the variable _titanic_.
2. We then load the __Age Feature__ from the dataset and store it in the variable _age_.
3. Displaying the first 10 rows shows us that we already have a missing entry (__NaN__, _not a number_). The _shape_ command shows us that there are 891 rows in total. 
4. We can check how many of those 891 have a value of NaN with the _isnull_ function. Summing them up shows us that we have 177 passengers of the Titanic where we do not know there age.
5. We can now use the __Mean Method__ to replace all of those with the mean age. For this we call the mean method on the values in _age_, round them up and store them inside the variable _mean_. Printing out the value, we can see that the mean age was _30_.
6. We can now use the __fillna Method__ to fill out every value that is NaN with the mean value. Taking a look at the first 10 rows again shows that the missing value has now been filled with the mean value 30.
7. To display our distribution - to be able to spot __Outliers__ - we import _PyPlot_ from the _MatPlotLib_ library as _plt_. We use the plt method to build a histogram of the values stored inside the _age_ variable and display the output with the show function.
8. To spot outliers we will set the __Minimum Value__ that we will accept for our model as the mean value for age MINUS _3-times the standard deviation_ of the age dataset. This turns out to be a negative value - given that this does not make any sense in our particular dataset, we can ignore outliers on minimum side of the distribution.
9. To spot outliers we will set the __Maximum Value__ that we will accept for our model as the mean value for age PLUS _3-times the standard deviation_ of the age dataset. Everyone who is listed as ~ 69 or above can be treated as an outlier.
10. We can thus define our _outlier_ variable as every value inside _age_ that is greater than _max\_val_. Counting the outliers shows us that we have _7_ inside our dataset.
11. We decide to remove all outliers from our dataset by only accepting values into our _age_ variable that are smaller or equal to _max\_val_. The shape command shows us that out of the initial 891 passengers we now eliminated 7 from our analysis - _884_.


### SciKit-Learn API

SciKit-Learn offers us a unified syntax to make machine learning more accessible. The SciKit-Learn API is divided into 3 interfaces:

* __Estimator Interface__: Used to create models and integrate your data.
* __Predictor Interface__: Used to make predictions based on the models created.
* __Transformer Interface__: Used to transform data files.


#### Estimation

This is the interface that you use to initialize a model and apply a fit() method to your data. Your data is received as two variables - __X_train__ is the feature matrix and __Y_train__ the target matrix for your model. _Unsupervised Models_ only use the first of those two arguments. A _Supervised Model_ takes both.


```python
from sklearn.naive_bayes import GaussianNB
model = GaussianNB()
model.fit(X_train, Y_train)
```

In the example of a supervised model, we imported the model we want to use, store it in the variable `model` and then apply it to our two arguments using the fit() method.


The Estimator can perform 3 more tasks for us:

* __Feature Extraction__: A transformation of the input data into numerical features.
* __Feature Selection__: Selecting a feature from your data that most contributes to the prediction output.
* __Dimensionality__: Converting your data into a lower dimension.


#### Predictor

The Predictor interface performs prediction based on the model you trained. In supervised models it creates a new dataset called __X_test__ and re-feeds it to your model. The implementation looks as follows:


```python
Y_pred = model.predict(X_test)
```

This allows us to quantify the __Confidence__ or __Performance__ of a model by comparing how far _X\_test_ differs from _Y\_test_.


#### Transformer

The Transform interface gives us a transform() method to preprocess our input data. Using the same transformation for the data that we use to train our model as well as the for the data we later use the model on to perform predictions ensures that both datasets are comparable in their distribution. An example is the __Normalization__ of a dataset:


```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
scaler.fit(X_train)
X_train = scaler.transform(X_train)
```

Here we imported the transformer and store it inside the variable `caler`. Our dataset is then fit to the imported method and the transformation performed.