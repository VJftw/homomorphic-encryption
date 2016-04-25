<?php

namespace spec\AppBundle\Entity;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationSpec
 * @package spec\AppBundle\Entity
 */
class ComputationSpec extends ObjectBehavior
{

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Entity\Computation');
    }

    function it_should_return_the_id()
    {
        $this->getId()
            ->shouldReturn(null)
        ;
    }

    function it_should_return_the_hash_id()
    {
        $this->getHashId()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_hash_id()
    {
        $this->setHashId("AxB43")
            ->shouldReturn($this)
        ;

        $this->getHashId()
            ->shouldReturn("AxB43")
        ;
    }

    function it_should_return_the_encryption_scheme()
    {
        $this->getEncryptionScheme()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_encryption_scheme()
    {
        $this->setEncryptionScheme("pailler")
            ->shouldReturn($this)
        ;

        $this->getEncryptionScheme()
            ->shouldReturn("pailler")
        ;
    }

    function it_should_return_the_timestamp()
    {
        $this->getTimestamp()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_timestamp()
    {
        $dateTime = new \DateTime('2015-04-03');
        $this->setTimestamp($dateTime)
            ->shouldReturn($this)
        ;

        $this->getTimestamp()
            ->shouldReturn($dateTime)
        ;
    }

    function it_should_return_the_ip_address()
    {
        $this->getIpAddress()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_ip_address()
    {
        $this->setIpAddress("127.0.0.1")
            ->shouldReturn($this)
        ;

        $this->getIpAddress()
            ->shouldReturn("127.0.0.1")
        ;
    }

    function it_should_return_the_auth_token()
    {
        $this->getAuthToken()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_auth_token()
    {
        $this->setAuthToken("abcdef")
            ->shouldReturn($this)
        ;

        $this->getAuthToken()
            ->shouldReturn("abcdef")
        ;
    }
}
