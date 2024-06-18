$if(name)$# $name$$endif$

$if(position)$## $position$$endif$

$if(info)$
::: {#info}
$for(info)$
- []{.fa .$info.icon$} $info.data$
$sep$
- \|
$endfor$
:::
$endif$

$if(summary)$
### Giới thiệu

$summary$
$endif$

$if(skill)$
### Kĩ năng

$for(skill)$
- $skill$
$endfor$
$endif$

$if(education)$
### Học vấn

$for(education)$
#### $education.place$

##### $education.major$

###### $education.time$

$for(education.extra)$
- $education.extra$
$endfor$
$endfor$
$endif$

$if(certificate)$
### Chứng chỉ và giải thưởng

$for(certificate)$
##### $certificate.year$

##### $certificate.name$

$for(certificate.extra)$
- $certificate.extra$
$endfor$

$endfor$
$endif$

$if(experiment)$
### Kinh nghiệm làm việc

$for(experiment)$
#### $experiment.place$

$for(experiment.phase)$
##### $experiment.phase.position$

###### $experiment.phase.time$

$for(experiment.phase.detail)$
- $experiment.phase.detail$
$endfor$

$endfor$
$endfor$
$endif$

$if(activity)$
### Hoạt động ngoại khóa

$for(activity)$
#### $activity.place$

$for(activity.phase)$
##### $activity.phase.position$

###### $activity.phase.time$

$for(activity.phase.detail)$
- $activity.phase.detail$
$endfor$

$endfor$
$endfor$
$endif$

$if(reference)$
### Tham chiếu

$for(reference)$
#### $reference.name$

##### $reference.position$

- []{.fa .fa-phone} $reference.phone$
- []{.fa .fa-envelope} $reference.email$

$endfor$
$endif$