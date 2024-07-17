---
font-size: $if(config.font-size)$$config.font-size$$else$11pt$endif$
font-family: $if(config.font-family)$$config.font-family$$else$Montserrat$endif$
font-weight: $if(config.font-weight)$$config.font-weight$$else$500$endif$
line-height: $if(config.line-height)$$config.line-height$$else$1.25$endif$
margin: $if(config.margin)$$config.margin$$else$0.5in$endif$
---
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

$if(experience)$
### Kinh nghiệm làm việc

$for(experience)$
#### $experience.place$

$for(experience.phase)$
##### $experience.phase.position$

###### $experience.phase.time$

$for(experience.phase.detail)$
- $experience.phase.detail$
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